// One-off data fix: assigns an id to every lesson-discussion comment that
// doesn't have one. Comments only got an `id` field once delete support was
// added, so anything posted before that is stuck — the client hides the
// delete button when a comment has no id, and the delete endpoint matches
// by id too, so those old comments could never be removed by anyone.
//
// Usage: node scripts/backfill-discussion-ids.js
import "dotenv/config";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  const courses = client.db("codelingo").collection("courses");
  const allCourses = await courses.find({}).toArray();

  let fixedComments = 0;
  let fixedLessons = 0;
  for (const course of allCourses) {
    for (const lesson of course.lessons || []) {
      const discussions = lesson.discussions || [];
      const missing = discussions.filter((m) => !m.id);
      if (!missing.length) continue;
      const updated = discussions.map((m) => (m.id ? m : { ...m, id: crypto.randomUUID() }));
      await courses.updateOne(
        { id: course.id, "lessons.id": lesson.id },
        { $set: { "lessons.$.discussions": updated } },
      );
      fixedComments += missing.length;
      fixedLessons += 1;
      console.log(`  ✓ ${course.title} — "${lesson.title}": backfilled ${missing.length} comment id(s).`);
    }
  }
  console.log(`Done. Backfilled ${fixedComments} comment(s) across ${fixedLessons} lesson(s).`);
} finally {
  await client.close();
}
