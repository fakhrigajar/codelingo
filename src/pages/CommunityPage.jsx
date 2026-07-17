import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { listPosts, createPost as createPostApi } from '../lib/postApi'
import { uid } from '../lib/helpers'
import PostComposer from '../components/community/PostComposer'
import PostCard from '../components/community/PostCard'
import AntdThemeProvider from '../components/common/AntdThemeProvider'

export default function CommunityPage() {
  const { currentUser, saveCurrentUser } = useAuth()
  const toast = useToast()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch(() => toast('Could not load community posts.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async ({ text, image, document }) => {
    const post = {
      id: uid('post'),
      username: currentUser.username,
      displayName: currentUser.displayName,
      text,
      image: image || null,
      document: document || null,
      time: Date.now(),
      likes: [],
      reports: [],
      replies: [],
    }
    setPosts((prev) => [post, ...prev])
    try {
      await createPostApi(post)
    } catch {
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
      toast('Could not publish that post — try again.')
      return
    }
    if (!currentUser.badges.includes('chatterbox')) {
      saveCurrentUser({ ...currentUser, badges: [...currentUser.badges, 'chatterbox'] })
      toast('New badge: Chatterbox')
    }
  }

  const patchPost = (id, patch) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removePostLocal = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <AntdThemeProvider>
      <div>
        <div className="pt-12 pb-2.5">
          <h1 className="text-[2.2rem]">Community</h1>
          <p className="text-ink-soft dark:text-white/60 max-w-[600px]">
            Share what you&apos;re building, ask questions, and help other learners — post a
            message, image or document, and reply, like or report what others share.
          </p>
        </div>

        <PostComposer onSubmit={handleCreate} />

        {loading ? (
          <p className="text-ink-soft dark:text-white/60 text-center py-10">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-ink-soft dark:text-white/60 text-center py-10">
            No posts yet — be the first to share something!
          </p>
        ) : (
          <div className="flex flex-col gap-5 mt-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onChange={(patch) => patchPost(post.id, patch)}
                onRemove={removePostLocal}
              />
            ))}
          </div>
        )}
      </div>
    </AntdThemeProvider>
  )
}
