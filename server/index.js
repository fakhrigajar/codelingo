import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json({ limit: '2mb' }))

const PORT = process.env.PORT || 3001
const MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// Shared helper: calls Gemini with a system prompt + schema, forcing JSON
// output, and normalizes error responses (missing key, bad request, rate
// limit) into a { status, message } shape both tool endpoints can reuse.
async function callGemini({ systemPrompt, userContent, schema, temperature = 0.4 }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw { status: 500, message: 'Server is missing GEMINI_API_KEY — add it to .env.' }
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

const INTERVIEW_SYSTEM_PROMPT = `You are an expert technical interviewer and career coach. Given a job role or topic, generate common interview FAQ questions to help a candidate practice, framed as multiple-choice quiz questions. Mix conceptual and practical/scenario questions appropriate for the role. Each question must have exactly 4 answer options, exactly one correct (0-indexed correctIndex), and a short explanation of why that answer is correct. Return JSON only matching the schema.`

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
        },
        required: ['question', 'options', 'correctIndex', 'explanation'],
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
      }))

    if (!questions.length) {
      return res.status(502).json({ error: 'Gemini did not return any usable questions.' })
    }

    res.json({ questions })
  } catch (err) {
    sendError(res, err)
  }
})

app.listen(PORT, () => {
  console.log(`AI tools proxy listening on http://localhost:${PORT}`)
})
