import { useState } from 'react'
import { Heart } from 'lucide-react'
import { initials } from '../../lib/helpers'
import { usePublicUsers } from '../../context/PublicUsersContext'
import Avatar from '../common/Avatar'

function timeAgo(ts) {
  const min = Math.floor(Math.max(0, Date.now() - ts) / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  return `${Math.floor(hr / 24)}d`
}

function ActionRow({ item, liked, onLike, onReplyClick }) {
  const likes = item.likes || []
  return (
    <div className="flex items-center gap-3 mt-1 pl-1 font-mono text-[.68rem] text-ink-soft dark:text-white/50">
      <button
        onClick={onLike}
        className={`inline-flex items-center gap-1 hover:text-coral ${liked ? 'text-coral' : ''}`}
      >
        <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
        {likes.length > 0 ? likes.length : 'Like'}
      </button>
      <button onClick={onReplyClick} className="font-bold hover:text-violet">
        Reply
      </button>
      <span>{timeAgo(item.time)}</span>
    </div>
  )
}

// One comment plus its single flat branch of replies — a reply-to-a-reply
// still lands in this same branch (see buildBranches in PostCard), so this
// never nests more than one level deep. The branch sits directly below the
// comment's own avatar (not indented under its text), and the connecting
// line only spans the branch list itself — it stops at the last reply and
// never bleeds into the "Hide replies" toggle below it.
export default function CommentItem({ comment, branch, currentUser, onLike, onStartReply }) {
  const [showBranch, setShowBranch] = useState(false)
  const { getUser } = usePublicUsers()

  const liked = currentUser && (comment.likes || []).includes(currentUser.username)
  const authorUser =
    currentUser && comment.username === currentUser.username ? currentUser : getUser(comment.username)

  const handleReplyClick = (target) => {
    if (branch.length > 0) setShowBranch(true)
    onStartReply(target)
  }

  return (
    <div>
      <div className="flex gap-2.5">
        {authorUser?.avatarUrl || authorUser?.avatarGradient ? (
          <Avatar user={authorUser} size={28} className="flex-shrink-0" />
        ) : (
          <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold text-[.65rem] flex-shrink-0">
            {initials(comment.displayName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="bg-[#F1F5FD] dark:bg-white/10 rounded-xl px-3 py-2">
            <div className="font-extrabold text-[.78rem]">{comment.displayName}</div>
            <div className="text-[.85rem] whitespace-pre-wrap">{comment.text}</div>
          </div>

          <ActionRow
            item={comment}
            liked={liked}
            onLike={() => onLike(comment.id)}
            onReplyClick={() => handleReplyClick({ id: comment.id, displayName: comment.displayName })}
          />

          {branch.length > 0 && !showBranch && (
            <button
              onClick={() => setShowBranch(true)}
              className="mt-1.5 pl-1 text-[.72rem] font-bold text-violet hover:underline"
            >
              View {branch.length} {branch.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>

      {showBranch && branch.length > 0 && (
        <div className="ml-[13px] pl-[19px] mt-2.5 border-l-2 border-line dark:border-white/10 flex flex-col gap-3">
          {branch.map((r) => {
            const rLiked = currentUser && (r.likes || []).includes(currentUser.username)
            const rAuthorUser =
              currentUser && r.username === currentUser.username ? currentUser : getUser(r.username)
            return (
              <div key={r.id} className="flex gap-2.5">
                {rAuthorUser?.avatarUrl || rAuthorUser?.avatarGradient ? (
                  <Avatar user={rAuthorUser} size={26} className="flex-shrink-0" />
                ) : (
                  <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold text-[.6rem] flex-shrink-0">
                    {initials(r.displayName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="bg-[#F1F5FD] dark:bg-white/10 rounded-xl px-3 py-2">
                    <div className="font-extrabold text-[.78rem]">{r.displayName}</div>
                    {r.replyTo && (
                      <div className="text-[.7rem] font-bold text-violet mb-0.5">
                        replies to @{r.replyTo.displayName}
                      </div>
                    )}
                    <div className="text-[.85rem] whitespace-pre-wrap">{r.text}</div>
                  </div>
                  <ActionRow
                    item={r}
                    liked={rLiked}
                    onLike={() => onLike(r.id)}
                    onReplyClick={() => handleReplyClick({ id: r.id, displayName: r.displayName })}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showBranch && branch.length > 0 && (
        <button
          onClick={() => setShowBranch(false)}
          className="ml-[13px] pl-[19px] mt-2 text-[.7rem] font-bold text-ink-soft dark:text-white/50 hover:underline"
        >
          Hide replies
        </button>
      )}
    </div>
  )
}
