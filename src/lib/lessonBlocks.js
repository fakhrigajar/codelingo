// Lessons render as an ordered list of content blocks. Video is singular (one
// per lesson) but image, lesson body and fun fact can repeat, so blocks are
// stored as instances ({ id, type, value }) rather than a fixed set of keys.
export const SINGLE_BLOCK_TYPES = ['video']
export const MULTI_BLOCK_TYPES = ['image', 'body', 'fact', 'link']
export const BLOCK_TYPE_LABELS = {
  video: 'Video',
  image: 'Image',
  body: 'Lesson body',
  fact: 'Fun fact',
  link: 'Link',
}
export const BLOCK_ADD_LABELS = {
  video: '+ Add video',
  image: '+ Add image',
  body: '+ Add lesson body',
  fact: '+ Add fun fact',
  link: '+ Add link',
}

// Lessons saved before per-block editing existed only have flat
// videoUrl/body/fact fields (plus an optional blockOrder of those three
// keys). Derive one block instance per non-empty legacy field so existing
// content keeps showing up until it's next edited and saved as `blocks`.
const LEGACY_FIELD = { video: 'videoUrl', body: 'body', fact: 'fact' }

export function getLessonBlocks(lesson) {
  if (Array.isArray(lesson.blocks)) return lesson.blocks
  const order = Array.isArray(lesson.blockOrder)
    ? lesson.blockOrder
    : ['video', 'body', 'fact'].filter((key) => Boolean(lesson[LEGACY_FIELD[key]]))
  return order
    .filter((key) => LEGACY_FIELD[key] && Boolean(lesson[LEGACY_FIELD[key]]))
    .map((key) => ({ id: key, type: key, value: lesson[LEGACY_FIELD[key]] }))
}

// A lesson's displayed time commitment is its written estimate plus however
// long its video actually runs (learned at playback time and cached on the
// lesson as videoMinutes — see LessonPanel).
export function getLessonMinutes(lesson) {
  return (lesson.estimatedMinutes || 0) + (lesson.videoMinutes || 0)
}

// Labels blocks "Fun fact" when there's only one, "Fun fact 1"/"Fun fact 2"
// when there are several of the same type.
export function labelLessonBlocks(blocks) {
  const totalByType = {}
  blocks.forEach((b) => {
    totalByType[b.type] = (totalByType[b.type] || 0) + 1
  })
  const seenByType = {}
  return blocks.map((b) => {
    seenByType[b.type] = (seenByType[b.type] || 0) + 1
    const label =
      totalByType[b.type] > 1 ? `${BLOCK_TYPE_LABELS[b.type]} ${seenByType[b.type]}` : BLOCK_TYPE_LABELS[b.type]
    return { ...b, label }
  })
}
