import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'

const app = express()
app.use(express.json({ limit: '2mb' }))

// Frontend (Netlify) and this API (Railway) live on different domains, so
// the browser needs an explicit CORS allowance. Restrict via ALLOWED_ORIGIN
// in production if you want to stop other sites from burning your Gemini
// quota — defaults to "*" so it works out of the box.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

const PORT = process.env.PORT || 3001
const MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// GET /api/health — check in Postman that the server is actually running and
// configured correctly (never returns the key itself, just whether it's set).
app.get('/api/health', async (req, res) => {
  const dbConnected = await mongoClient
    .db('codelingo')
    .command({ ping: 1 })
    .then(() => true)
    .catch(() => false)

  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    model: MODEL,
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    allowedOrigin: ALLOWED_ORIGIN,
    dbConnected,
  })
})

// This is now the app's actual database (courses, paths and users no
// longer live in the browser's localStorage) — persisted in MongoDB so it
// survives restarts and redeploys, not just kept in server memory.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const mongoClient = new MongoClient(MONGODB_URI)

const NO_ID_PROJECTION = { projection: { _id: 0 } }

function makeCrudRoutes(basePath, collection, { idField = 'id', requiredFields = ['id'], sort = { _id: 1 } } = {}) {
  app.get(basePath, async (req, res) => {
    res.json(await collection.find({}, NO_ID_PROJECTION).sort(sort).toArray())
  })

  app.get(`${basePath}/:id`, async (req, res) => {
    const item = await collection.findOne({ [idField]: req.params.id }, NO_ID_PROJECTION)
    if (!item) return res.status(404).json({ error: `Not found: ${req.params.id}` })
    res.json(item)
  })

  app.post(basePath, async (req, res) => {
    const item = req.body
    const missing = requiredFields.filter((f) => !item?.[f])
    if (missing.length) return res.status(400).json({ error: `Missing required field(s): ${missing.join(', ')}` })
    const existing = await collection.findOne({ [idField]: item[idField] })
    if (existing) return res.status(409).json({ error: `Already exists: ${item[idField]}` })
    await collection.insertOne({ ...item })
    res.status(201).json(item)
  })

  // Upsert by id: updates the item if it exists, creates it otherwise. This
  // is what admin edits and lesson-progress saves use, since those are
  // frequent partial updates rather than one-time creation.
  app.put(`${basePath}/:id`, async (req, res) => {
    const incoming = { ...(req.body || {}) }
    delete incoming[idField] // the URL is the source of truth for the id
    const existing = await collection.findOne({ [idField]: req.params.id })
    if (!existing) {
      const missing = requiredFields.filter((f) => f !== idField && !incoming[f])
      if (missing.length) return res.status(400).json({ error: `Missing required field(s): ${missing.join(', ')}` })
    }
    const updated = await collection.findOneAndUpdate(
      { [idField]: req.params.id },
      { $set: { ...incoming, [idField]: req.params.id } },
      { upsert: true, returnDocument: 'after', ...NO_ID_PROJECTION },
    )
    res.status(existing ? 200 : 201).json(updated)
  })

  app.delete(`${basePath}/:id`, async (req, res) => {
    const removed = await collection.findOneAndDelete({ [idField]: req.params.id }, NO_ID_PROJECTION)
    if (!removed) return res.status(404).json({ error: `Not found: ${req.params.id}` })
    res.json(removed)
  })

  app.delete(basePath, async (req, res) => {
    await collection.deleteMany({})
    res.json({ removed: true })
  })
}

// Community chat and lesson discussions don't fit the id-based CRUD shape
// above (no single record is ever fetched/edited/deleted by id — messages
// are only ever listed per room/lesson and appended to), so they get their
// own small scoped routes instead of makeCrudRoutes.
function makeThreadRoutes(basePath, collection, scopeFields) {
  app.get(basePath, async (req, res) => {
    res.json(await collection.find({}, NO_ID_PROJECTION).sort({ time: 1 }).toArray())
  })

  const scopedPath = `${basePath}/${scopeFields.map((f) => `:${f}`).join('/')}`

  app.get(scopedPath, async (req, res) => {
    const scope = Object.fromEntries(scopeFields.map((f) => [f, req.params[f]]))
    res.json(await collection.find(scope, NO_ID_PROJECTION).sort({ time: 1 }).toArray())
  })

  app.post(scopedPath, async (req, res) => {
    const { username, displayName, text } = req.body || {}
    if (!username || !displayName || !text || !text.trim()) {
      return res.status(400).json({ error: 'username, displayName and text are required.' })
    }
    const scope = Object.fromEntries(scopeFields.map((f) => [f, req.params[f]]))
    const message = { ...scope, username, displayName, text: text.trim(), time: Date.now() }
    await collection.insertOne({ ...message })
    res.status(201).json(message)
  })

  app.delete(scopedPath, async (req, res) => {
    const scope = Object.fromEntries(scopeFields.map((f) => [f, req.params[f]]))
    await collection.deleteMany(scope)
    res.json({ removed: true })
  })
}

async function start() {
  await mongoClient.connect()
  const db = mongoClient.db('codelingo')
  const coursesCollection = db.collection('courses')
  const pathsCollection = db.collection('paths')
  const usersCollection = db.collection('users')
  const messagesCollection = db.collection('messages')
  const discussionsCollection = db.collection('discussions')

  // One-time migration from the old lesson-linking "grades" model to
  // "paths" (an ordered list of whole courses) — the two shapes aren't
  // compatible, so this only carries over the label as an empty path for
  // the admin to fill in. Leaves the old "grades" collection untouched.
  if ((await pathsCollection.countDocuments()) === 0) {
    const legacyGrades = await db.collection('grades').find({}).toArray()
    if (legacyGrades.length) {
      await pathsCollection.insertMany(
        legacyGrades.map((g) => ({ id: g.id, label: g.label, level: 'Beginner', courseIds: [] })),
      )
    }
  }

  // courses and paths no longer have hardcoded defaults in the frontend
  // bundle — MongoDB is the sole source of truth for all three resources.
  makeCrudRoutes('/api/courses', coursesCollection, { sort: { order: 1, _id: 1 } })
  makeCrudRoutes('/api/paths', pathsCollection, { idField: 'id', requiredFields: ['id', 'label'] })
  makeCrudRoutes('/api/users', usersCollection, { idField: 'username', requiredFields: ['username', 'displayName'] })
  makeThreadRoutes('/api/messages', messagesCollection, ['roomId'])
  makeThreadRoutes('/api/discussions', discussionsCollection, ['courseId', 'lessonId'])

  app.listen(PORT, () => {
    console.log(`AI tools proxy listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  console.error(`Could not connect to MongoDB at ${MONGODB_URI} — is it running? Set MONGODB_URI to point elsewhere.`)
  process.exit(1)
})

// Shared helper: calls Gemini with a system prompt + schema, forcing JSON
// output, and normalizes error responses (missing key, bad request, rate
// limit) into a { status, message } shape both tool endpoints can reuse.
async function callGemini({ systemPrompt, userContent, schema, temperature = 0.4 }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw {
      status: 500,
      message:
        'Server is missing GEMINI_API_KEY — set it in your environment variables (e.g. Railway\'s Variables tab, or a local .env file).',
    }
  }

  let geminiRes
  try {
    geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userContent }] }],
        generationConfig: {
          temperature,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    })
  } catch {
    throw { status: 502, message: 'Could not reach Gemini.' }
  }

  if (!geminiRes.ok) {
    const body = await geminiRes.json().catch(() => null)
    const message = body?.error?.message || `Gemini request failed (${geminiRes.status}).`
    if (geminiRes.status === 400 || geminiRes.status === 403) {
      throw { status: geminiRes.status, message: `Gemini rejected the request: ${message}` }
    }
    if (geminiRes.status === 429) {
      throw { status: 429, message: 'Gemini rate-limited this request — wait a moment and try again.' }
    }
    throw { status: geminiRes.status, message }
  }

  const data = await geminiRes.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw { status: 502, message: 'Gemini returned an empty response.' }
  }

  try {
    return JSON.parse(content)
  } catch {
    throw { status: 502, message: 'Could not parse the AI response.' }
  }
}

function sendError(res, err) {
  const status = err?.status || 502
  const message = err?.message || 'Something went wrong.'
  res.status(status).json({ error: message })
}

const CV_SYSTEM_PROMPT = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Analyze the resume text the user provides and return your assessment as JSON matching the provided schema. If no target role is given, return an empty array for keywordGaps.`

const CV_SCHEMA = {
  type: 'OBJECT',
  properties: {
    score: { type: 'NUMBER' },
    summary: { type: 'STRING' },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    improvements: { type: 'ARRAY', items: { type: 'STRING' } },
    keywordGaps: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['score', 'summary', 'strengths', 'improvements', 'keywordGaps'],
}

app.post('/api/analyze-cv', async (req, res) => {
  const { resumeText, targetRole } = req.body || {}
  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: 'resumeText is required.' })
  }

  const userContent = targetRole?.trim()
    ? `Target role / keywords:\n${targetRole.trim()}\n\nResume:\n${resumeText}`
    : `Resume:\n${resumeText}`

  try {
    const parsed = await callGemini({ systemPrompt: CV_SYSTEM_PROMPT, userContent, schema: CV_SCHEMA })
    res.json({
      score: Math.max(0, Math.min(100, Math.round(parsed.score ?? 0))),
      summary: parsed.summary || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      keywordGaps: Array.isArray(parsed.keywordGaps) ? parsed.keywordGaps : [],
    })
  } catch (err) {
    sendError(res, err)
  }
})

const INTERVIEW_SYSTEM_PROMPT = `You are an expert technical interviewer and career coach. Given a job role or topic, generate common interview FAQ questions to help a candidate practice, framed as multiple-choice quiz questions. Mix conceptual and practical/scenario questions appropriate for the role. Each question must have exactly 4 answer options, exactly one correct (0-indexed correctIndex), a short explanation of why that answer is correct, and a short "topic" tag (2-4 words, e.g. "React Hooks", "Big-O Notation") naming the specific concept the question tests — this is used to track a candidate's knowledge gaps. Return JSON only matching the schema.`

const INTERVIEW_SCHEMA = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING' },
          options: { type: 'ARRAY', items: { type: 'STRING' } },
          correctIndex: { type: 'NUMBER' },
          explanation: { type: 'STRING' },
          topic: { type: 'STRING' },
        },
        required: ['question', 'options', 'correctIndex', 'explanation', 'topic'],
      },
    },
  },
  required: ['questions'],
}

app.post('/api/interview-questions', async (req, res) => {
  const { role, count } = req.body || {}
  if (!role || !role.trim()) {
    return res.status(400).json({ error: 'role is required.' })
  }
  const n = Math.min(Math.max(parseInt(count, 10) || 8, 3), 15)

  const userContent = `Role or topic: ${role.trim()}\nGenerate exactly ${n} multiple-choice interview practice questions for this role/topic.`

  try {
    const parsed = await callGemini({
      systemPrompt: INTERVIEW_SYSTEM_PROMPT,
      userContent,
      schema: INTERVIEW_SCHEMA,
      temperature: 0.6,
    })

    const questions = (Array.isArray(parsed.questions) ? parsed.questions : [])
      .filter((q) => q && q.question && Array.isArray(q.options) && q.options.length === 4)
      .map((q) => ({
        question: q.question,
        options: q.options,
        correctIndex: Math.min(Math.max(Math.round(q.correctIndex ?? 0), 0), 3),
        explanation: q.explanation || '',
        topic: q.topic || q.question,
      }))

    if (!questions.length) {
      return res.status(502).json({ error: 'Gemini did not return any usable questions.' })
    }

    res.json({ questions })
  } catch (err) {
    sendError(res, err)
  }
})

const WIREFRAME_BLOCK_TYPES = ['header', 'nav', 'hero', 'sidebar', 'form', 'list', 'grid', 'chart', 'footer']

const PROJECT_SYSTEM_PROMPT = `You are a programming mentor who helps developers find their next build. Given a programming language and a skill level, generate exactly 10 distinct project ideas suited to that level. Vary the domains (web, CLI, games, data, automation, etc.) so ideas don't feel repetitive. Each idea needs a short punchy title, a description, a short array of key skills/concepts it practices, an estimated time to build, and a "wireframe": a list of 3-6 blocks (top to bottom) sketching the main screen so a beginner can visualize what to actually build. Each wireframe block has a "block" field that MUST be one of exactly: ${WIREFRAME_BLOCK_TYPES.join(', ')} — and a short "label" describing what goes there (e.g. block "hero", label "Welcome message + call-to-action button"). For non-visual projects (CLI tools, scripts), sketch the terminal/output flow instead using "list" and "form" blocks (e.g. label "Prompts user for input", "Prints formatted result"). Return JSON only matching the schema.`

const PROJECT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    ideas: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          skills: { type: 'ARRAY', items: { type: 'STRING' } },
          estimatedTime: { type: 'STRING' },
          wireframe: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                block: { type: 'STRING' },
                label: { type: 'STRING' },
              },
              required: ['block', 'label'],
            },
          },
        },
        required: ['title', 'description', 'skills', 'estimatedTime', 'wireframe'],
      },
    },
  },
  required: ['ideas'],
}

app.post('/api/project-ideas', async (req, res) => {
  const { language, level, detailed } = req.body || {}
  if (!language || !language.trim()) {
    return res.status(400).json({ error: 'language is required.' })
  }
  const lvl = ['basic', 'medium', 'advanced'].includes(level) ? level : 'basic'

  const userContent = `Programming language: ${language.trim()}\nSkill level: ${lvl}\n${
    detailed
      ? 'Write a detailed description for each idea (4-6 sentences) covering the core features to build and why it is good practice.'
      : 'Write a brief description for each idea (1-2 sentences).'
  }\nGenerate exactly 10 project ideas.`

  try {
    const parsed = await callGemini({
      systemPrompt: PROJECT_SYSTEM_PROMPT,
      userContent,
      schema: PROJECT_SCHEMA,
      temperature: 0.8,
    })

    const ideas = (Array.isArray(parsed.ideas) ? parsed.ideas : [])
      .filter((i) => i && i.title && i.description)
      .map((i) => ({
        title: i.title,
        description: i.description,
        skills: Array.isArray(i.skills) ? i.skills : [],
        estimatedTime: i.estimatedTime || '',
        wireframe: (Array.isArray(i.wireframe) ? i.wireframe : [])
          .filter((b) => b && WIREFRAME_BLOCK_TYPES.includes(b.block))
          .map((b) => ({ block: b.block, label: b.label || '' }))
          .slice(0, 6),
      }))

    if (!ideas.length) {
      return res.status(502).json({ error: 'Gemini did not return any usable project ideas.' })
    }

    res.json({ ideas })
  } catch (err) {
    sendError(res, err)
  }
})

const LEARNING_PATH_SYSTEM_PROMPT = `You are an expert curriculum designer and career mentor. Given a learner's age, experience level, and stated goal, design a personalized step-by-step learning path from foundational skills up to that goal, in the correct learning order (fundamentals first, the goal itself or a capstone like "Portfolio" last). Return 6-10 steps. Each step needs a short title (1-3 words, e.g. "HTML", "Flexbox", "Portfolio") and a one-sentence description of what to do at that step and why it matters, tailored to the learner's age and experience level. Return JSON only matching the schema.`

const LEARNING_PATH_SCHEMA = {
  type: 'OBJECT',
  properties: {
    steps: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['steps'],
}

app.post('/api/learning-path', async (req, res) => {
  const { age, experience, goal } = req.body || {}
  if (!goal || !goal.trim()) {
    return res.status(400).json({ error: 'goal is required.' })
  }

  const userContent = `Age: ${age || 'not specified'}\nExperience level: ${experience || 'not specified'}\nGoal: ${goal.trim()}\nDesign a personalized step-by-step learning path to reach this goal.`

  try {
    const parsed = await callGemini({
      systemPrompt: LEARNING_PATH_SYSTEM_PROMPT,
      userContent,
      schema: LEARNING_PATH_SCHEMA,
      temperature: 0.6,
    })

    const steps = (Array.isArray(parsed.steps) ? parsed.steps : [])
      .filter((s) => s && s.title)
      .map((s) => ({ title: s.title, description: s.description || '' }))

    if (!steps.length) {
      return res.status(502).json({ error: 'Gemini did not return a usable learning path.' })
    }

    res.json({ steps })
  } catch (err) {
    sendError(res, err)
  }
})
