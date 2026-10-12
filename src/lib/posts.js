import { createLocalCollection } from './localStore'
import { DEFAULT_POSTS, DEFAULT_USERS } from '../data/data'
import { uid } from './helpers'

const posts = createLocalCollection('posts', 'id', DEFAULT_POSTS)
const users = createLocalCollection('users', 'username', DEFAULT_USERS)
const deletions = createLocalCollection('post-deletions')
const toggle = (list, username) => list.includes(username) ? list.filter((name) => name !== username) : [...list, username]

export const listPosts = async () => (await posts.list()).sort((a, b) => b.time - a.time)
export const createPost = (post) => posts.create(post)
export const listPostDeletions = async () => (await deletions.list()).sort((a, b) => b.time - a.time)

export async function removePost(id, requestedBy) {
  const post = await posts.get(id)
  const requester = await users.get(requestedBy)
  if (requestedBy !== post.username && requester.role !== 'admin') throw new Error('Not allowed to delete this post.')
  await deletions.create({ id: uid('deletion'), postId: id, postOwner: post.username,
    postOwnerDisplayName: post.displayName, postText: post.text, deletedBy: requestedBy,
    deletedByDisplayName: requester.displayName, deletedBySelf: requestedBy === post.username, time: Date.now() })
  return posts.remove(id)
}
export async function likePost(id, username) {
  const post = await posts.get(id)
  return posts.update(id, { likes: toggle(post.likes || [], username) })
}
export async function reportPost(id, username, reason = '') {
  const post = await posts.get(id)
  if (!(post.reports || []).some((report) => report.username === username)) {
    await posts.update(id, { reports: [...(post.reports || []), { username, reason: reason.trim(), time: Date.now() }] })
  }
  return { reported: true }
}
export async function replyToPost(id, reply) {
  if (!reply.username || !reply.displayName || !reply.text?.trim()) throw new Error('Please enter a reply.')
  const post = await posts.get(id)
  const saved = { ...reply, text: reply.text.trim(), id: uid('reply'), time: Date.now(), likes: [], replyTo: reply.replyTo || null }
  await posts.update(id, { replies: [...(post.replies || []), saved] })
  return saved
}
export async function likeReply(postId, replyId, username) {
  const post = await posts.get(postId)
  return posts.update(postId, { replies: (post.replies || []).map((reply) => reply.id === replyId
    ? { ...reply, likes: toggle(reply.likes || [], username) } : reply) })
}
