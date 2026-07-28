import { YoutubeTranscript } from "youtube-transcript";
import { getLessonBlocks } from "./lessonBlocks.js";
import { getYouTubeVideoId } from "./videoEmbed.js";

// Best-effort plain-text summary of a lesson's actual content, for feeding to
// an AI prompt. Prefers the video's captions (Turkish first — auto-translated
// captions for these videos default to Arabic and are much less accurate),
// and falls back to the lesson's written blocks for lessons with no video.
export async function getLessonContentText(lesson, maxLength = 20000) {
  const blocks = getLessonBlocks(lesson);
  const videoBlock = blocks.find((b) => b.type === "video" && b.value);
  const videoId = videoBlock && getYouTubeVideoId(videoBlock.value);
  if (videoId) {
    for (const opts of [{ lang: "tr" }, undefined]) {
      try {
        const segments = await YoutubeTranscript.fetchTranscript(videoId, opts);
        const text = segments.map((s) => s.text).join(" ").trim();
        if (text) return text.slice(0, maxLength);
      } catch {
        // No captions in that language (or at all) — try the next option,
        // then fall through to the lesson's text blocks below.
      }
    }
  }
  return blocks
    .filter((b) => ["body", "fact"].includes(b.type) && b.value)
    .map((b) => b.value)
    .concat(blocks.filter((b) => b.type === "link" && b.title).map((b) => b.title))
    .join("\n")
    .slice(0, maxLength);
}
