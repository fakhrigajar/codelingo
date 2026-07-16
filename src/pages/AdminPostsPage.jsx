import { useEffect, useState } from 'react'
import { Tabs, Image } from 'antd'
import { Flag, Trash2, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { listPosts, removePost, listPostDeletions } from '../lib/postApi'
import AdminCard from '../components/admin/AdminCard'
import { AdminButton } from '../components/admin/AdminFields'
import DocumentViewerModal from '../components/community/DocumentViewerModal'

function PostRow({ post, onDelete, reportBadge }) {
  const [docOpen, setDocOpen] = useState(false)

  return (
    <AdminCard>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold">{post.displayName}</span>
            <span className="font-mono text-[.72rem] text-ink-soft dark:text-white/50">
              {new Date(post.time).toLocaleString()}
            </span>
          </div>

          {post.text && (
            <p className="text-[.9rem] text-ink-soft dark:text-white/60 mt-1 whitespace-pre-wrap">
              {post.text}
            </p>
          )}

          {post.image && (
            <Image
              src={post.image.url}
              alt=""
              width={64}
              height={64}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              rootClassName="mt-2 block"
            />
          )}

          {post.document && (
            <>
              <button
                type="button"
                onClick={() => setDocOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 bg-[#F1F5FD] dark:bg-white/10 rounded-lg px-2.5 py-1.5 text-[.8rem] font-bold hover:opacity-85"
              >
                <FileText size={13} /> {post.document.name}
              </button>
              <DocumentViewerModal
                document={post.document}
                open={docOpen}
                onClose={() => setDocOpen(false)}
              />
            </>
          )}

          <div className="flex items-center gap-3 mt-2 text-[.78rem] text-ink-soft dark:text-white/50 font-mono">
            <span>{(post.likes || []).length} likes</span>
            <span>{(post.replies || []).length} comments</span>
            {reportBadge}
          </div>
        </div>
        <AdminButton variant="danger" onClick={() => onDelete(post)} aria-label="Delete post">
          <Trash2 size={14} />
        </AdminButton>
      </div>
    </AdminCard>
  )
}

export default function AdminPostsPage() {
  const { currentUser } = useAuth()
  const toast = useToast()
  const [posts, setPosts] = useState([])
  const [deletions, setDeletions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listPosts(), listPostDeletions()])
      .then(([p, d]) => {
        setPosts(p)
        setDeletions(d)
      })
      .catch(() => toast('Could not load posts.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reported = posts.filter((p) => (p.reports || []).length > 0)

  const handleDelete = async (post) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      await removePost(post.id, currentUser.username)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
      listPostDeletions().then(setDeletions).catch(() => {})
      toast('Post deleted')
    } catch {
      toast('Could not delete that post — try again.')
    }
  }

  const items = [
    {
      key: 'all',
      label: `All posts (${posts.length})`,
      children:
        posts.length === 0 ? (
          <AdminCard>
            <p className="text-ink-soft dark:text-white/60 text-[.9rem]">No posts yet.</p>
          </AdminCard>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostRow key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        ),
    },
    {
      key: 'reported',
      label: `Reported (${reported.length})`,
      children:
        reported.length === 0 ? (
          <AdminCard>
            <p className="text-ink-soft dark:text-white/60 text-[.9rem]">
              Nothing has been reported — the community is behaving.
            </p>
          </AdminCard>
        ) : (
          <div className="space-y-4">
            {reported.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                onDelete={handleDelete}
                reportBadge={
                  <span className="inline-flex items-center gap-1 text-coral font-bold">
                    <Flag size={12} /> Reported {post.reports.length} time
                    {post.reports.length === 1 ? '' : 's'}
                  </span>
                }
              />
            ))}
          </div>
        ),
    },
    {
      key: 'deletions',
      label: `Deletion log (${deletions.length})`,
      children: (
        <AdminCard>
          <p className="text-ink-soft dark:text-white/60 text-[.85rem] mb-3">
            Only a post&apos;s own author or an admin can delete it — enforced by the server, not
            just this UI. Every deletion (self or admin) is recorded here.
          </p>
          {deletions.length === 0 ? (
            <p className="text-ink-soft dark:text-white/60 text-[.9rem]">
              No posts have been deleted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {deletions.map((d) => (
                <div
                  key={d.id}
                  className="text-[.85rem] border-b border-line dark:border-white/10 pb-2.5 last:border-0 last:pb-0"
                >
                  <div>
                    <strong className="text-ink dark:text-white">{d.deletedBy}</strong>{' '}
                    deleted {d.deletedBySelf ? 'their own post' : `${d.postOwnerDisplayName}'s post`}
                    <span className="font-mono text-[.72rem] text-ink-soft dark:text-white/50 ml-2">
                      {new Date(d.time).toLocaleString()}
                    </span>
                  </div>
                  {d.postText && (
                    <p className="text-ink-soft dark:text-white/60 mt-0.5 truncate">
                      &quot;{d.postText}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-2xl mb-1">Community posts</h1>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        Manage everything posted in the community — view content, delete posts, and review
        reports.
      </p>
      {loading ? (
        <p className="text-ink-soft dark:text-white/60">Loading…</p>
      ) : (
        <Tabs items={items} />
      )}
    </div>
  )
}
