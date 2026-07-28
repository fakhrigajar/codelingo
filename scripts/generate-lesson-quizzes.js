// One-off content-generation tool: writes a fixed, permanent multiple-choice
// practice quiz onto each lesson of a course (lesson.practiceQuiz), sourced
// from the lesson's actual video captions (or its text blocks, for lessons
// with no video). This is NOT called by the running app — quizzes are
// generated once here and then just read as stored data, so every learner
// sees the same questions and nothing regenerates on each view.
//
// Usage: node scripts/generate-lesson-quizzes.js [courseId] [--force]
//   courseId  defaults to "course-mrs03936-l0rqe" (Essential Lessons for Everyone)
//   --force   regenerate even for lessons that already have a practiceQuiz
import "dotenv/config";
import { MongoClient } from "mongodb";
import { getLessonContentText } from "../src/lib/lessonContentText.js";

const args = process.argv.slice(2);
const force = args.includes("--force");
const courseId = args.find((a) => !a.startsWith("--")) || "course-mrs03936-l0rqe";
const QUESTIONS_PER_LESSON = 5;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are an expert instructional designer creating multiple-choice fill-in-the-blank (cloze) comprehension questions from a lesson's video transcript or notes. Given the lesson's content, write exactly the requested number of questions that test understanding of the important concepts actually covered in that content — not trivia, not filler words. Each question is a single sentence describing or restating a concept from the content, with exactly one key term or short phrase replaced by a blank written as exactly five underscores: _____. Provide exactly 4 answer options for the blank — one correct (matching the content) and three plausible but incorrect distractors of similar length and style — and the 0-based index of the correct option. Write the sentence and every option in the SAME language as the provided content. Return JSON only matching the schema.`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sentence: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correctIndex: { type: "NUMBER" },
        },
        required: ["sentence", "options", "correctIndex"],
      },
    },
  },
  required: ["questions"],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The free tier caps gemini-2.5-flash at ~5 requests/minute, and this script
// can easily fire dozens of requests across a large course, so every call
// (including retries) is paced to stay under that, and 429/"high demand"
// responses are retried with backoff instead of just being logged as a
// permanent per-lesson failure.
const MIN_REQUEST_INTERVAL_MS = 13000;
let lastRequestAt = 0;

async function pace() {
  const wait = lastRequestAt + MIN_REQUEST_INTERVAL_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

async function callGeminiWithRetry(body, maxAttempts = 6) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await pace();
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();

    const errBody = await res.json().catch(() => null);
    const message = errBody?.error?.message || `Gemini request failed (${res.status}).`;
    const isRateLimited = res.status === 429 || /quota|high demand/i.test(message);
    if (!isRateLimited || attempt === maxAttempts) {
      throw new Error(message);
    }
    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    const waitMs = retryMatch
      ? Math.ceil(parseFloat(retryMatch[1]) * 1000) + 2000
      : MIN_REQUEST_INTERVAL_MS * attempt;
    console.log(
      `    rate-limited (attempt ${attempt}/${maxAttempts}), waiting ${Math.round(waitMs / 1000)}s...`,
    );
    await sleep(waitMs);
  }
}

async function generateQuizForLesson(lesson) {
  const content = await getLessonContentText(lesson);
  if (!content) {
    console.log(`  skip "${lesson.title}" — no usable content (no captions, no text blocks).`);
    return null;
  }

  const userContent = `Lesson "${lesson.title}":\n${content}\n\nGenerate exactly ${QUESTIONS_PER_LESSON} multiple-choice fill-in-the-blank questions from this content.`;

  const data = await callGeminiWithRetry({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text: userContent }] }],
    generationConfig: {
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
    },
  });
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  const parsed = JSON.parse(text);

  const BLANK_RE = /_{3,}/;
  const questions = (Array.isArray(parsed.questions) ? parsed.questions : [])
    .filter(
      (q) =>
        q &&
        typeof q.sentence === "string" &&
        BLANK_RE.test(q.sentence) &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.correctIndex) &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3,
    )
    .map((q) => ({
      q: q.sentence.replace(BLANK_RE, "_____"),
      options: q.options,
      correct: q.correctIndex,
    }));

  return questions.length ? questions : null;
}

const client = new MongoClient(MONGODB_URI);
try {
  await client.connect();
  const courses = client.db("codelingo").collection("courses");
  const course = await courses.findOne({ id: courseId });
  if (!course) {
    console.error(`No course found with id "${courseId}".`);
    process.exit(1);
  }

  console.log(`Course: ${course.title} (${course.lessons.length} lessons)`);
  for (const lesson of course.lessons) {
    if (!force && Array.isArray(lesson.practiceQuiz) && lesson.practiceQuiz.length) {
      console.log(`  skip "${lesson.title}" — already has a practiceQuiz (use --force to regenerate).`);
      continue;
    }
    console.log(`  generating for "${lesson.title}"...`);
    try {
      const questions = await generateQuizForLesson(lesson);
      if (!questions) {
        console.log(`  ✗ "${lesson.title}" — no usable questions came back.`);
        continue;
      }
      await courses.updateOne(
        { id: courseId, "lessons.id": lesson.id },
        { $set: { "lessons.$.practiceQuiz": questions } },
      );
      console.log(`  ✓ "${lesson.title}" — stored ${questions.length} questions.`);
    } catch (err) {
      console.log(`  ✗ "${lesson.title}" — ${err.message}`);
    }
  }
} finally {
  await client.close();
}
