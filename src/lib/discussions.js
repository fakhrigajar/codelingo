import { createLocalCollection } from './localStore'
import { DEFAULT_USERS } from '../data/data'
import { uid } from './helpers'

const comments = (courseId, lessonId) => createLocalCollection(`discussion:${courseId}:${lessonId}`)
const users = createLocalCollection('users', 'username', DEFAULT_USERS)
export const listComments = (courseId, lessonId) => comments(courseId, lessonId).list()
export async function postComment(courseId, lessonId, comment) {
  if (!comment.username || !comment.displayName || !comment.text?.trim()) throw new Error('Please enter a comment.')
  return comments(courseId, lessonId).create({ ...comment, id: uid('comment'), text: comment.text.trim(), time: Date.now() })
}
export async function deleteComment(courseId, lessonId, messageId, requestedBy) {
  const store = comments(courseId, lessonId)
  const message = await store.get(messageId)
  const requester = await users.get(requestedBy)
  if (message.username !== requestedBy && requester.role !== 'admin') throw new Error('Not allowed to delete this comment.')
  return store.remove(messageId)
}
