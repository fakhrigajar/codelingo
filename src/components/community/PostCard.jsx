import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "antd";
import { Heart, MessageCircle, Flag, FileText, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePublicUsers } from "../../context/PublicUsersContext";
import { useToast } from "../../context/ToastContext";
import { initials } from "../../lib/helpers";
import { resolveUploadUrl } from "../../lib/resolveUploadUrl";
import {
  likePost,
  reportPost,
  replyToPost,
  likeReply,
  removePost,
} from "../../lib/postApi";
import CommentItem from "./CommentItem";
import DocumentViewerModal from "./DocumentViewerModal";
import Avatar from "../common/Avatar";

// Comments (replyTo === null) each get exactly one flat branch of replies —
// even a reply-to-a-reply is walked up to its root comment and dropped in
// that same branch, so the UI never has to render more than one level of
// nesting no matter how deep the actual replyTo chain goes.
function buildBranches(replies) {
  const byId = new Map(replies.map((r) => [r.id, r]));
  const roots = replies.filter((r) => !r.replyTo);
  const branches = new Map(roots.map((r) => [r.id, []]));

  replies
    .filter((r) => r.replyTo)
    .forEach((r) => {
      let current = r;
      const seen = new Set();
      while (
        current.replyTo &&
        byId.has(current.replyTo.id) &&
        !seen.has(current.id)
      ) {
        seen.add(current.id);
        current = byId.get(current.replyTo.id);
      }
      if (!branches.has(current.id)) branches.set(current.id, []);
      branches.get(current.id).push(r);
    });

  branches.forEach((list) => list.sort((a, b) => a.time - b.time));
  return { roots: [...roots].sort((a, b) => a.time - b.time), branches };
}

export default function PostCard({ post, onChange, onRemove }) {
  const { currentUser } = useAuth();
  const { getUser } = usePublicUsers();
  const toast = useToast();
  const navigate = useNavigate();

  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [docViewerOpen, setDocViewerOpen] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (replyTarget) commentInputRef.current?.focus();
  }, [replyTarget]);

  const requireAuth = () => {
    if (currentUser) return true;
    toast("Log in to join the conversation!");
    navigate("/account");
    return false;
  };

  const likes = post.likes || [];
  const reports = post.reports || [];
  const replies = post.replies || [];
  const liked = currentUser && likes.includes(currentUser.username);
  const reported =
    currentUser && reports.some((r) => r.username === currentUser.username);
  // Inline delete is owner-only — an admin deleting someone else's post is a
  // moderation action that belongs on the admin "All posts" page (with a
  // reason it's visible there), not a stray trash icon in the public feed.
  // The server still allows admin deletes; this only narrows the UI.
  const canDelete = currentUser && currentUser.username === post.username;
  const { roots: comments, branches } = buildBranches(replies);
  const authorUser =
    currentUser && post.username === currentUser.username
      ? currentUser
      : getUser(post.username);

  const time = new Date(post.time).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleLike = async () => {
    if (!requireAuth()) return;
    const nextLikes = liked
      ? likes.filter((u) => u !== currentUser.username)
      : [...likes, currentUser.username];
    onChange({ likes: nextLikes });
    try {
      const updated = await likePost(post.id, currentUser.username);
      onChange({ likes: updated.likes });
    } catch {
      onChange({ likes });
      toast("Could not update like — try again.");
    }
  };

  const handleReport = async () => {
    if (!requireAuth()) return;
    if (reported) {
      toast("You already reported this post.");
      return;
    }
    if (!confirm("Report this post to the moderators?")) return;
    try {
      await reportPost(post.id, currentUser.username);
      onChange({
        reports: [
          ...reports,
          { username: currentUser.username, time: Date.now() },
        ],
      });
      toast("Post reported. Thanks for flagging it.");
    } catch {
      toast("Could not report that post — try again.");
    }
  };

  const handleSubmitComment = async () => {
    if (!requireAuth()) return;
    const text = replyText.trim();
    if (!text) return;
    setBusy(true);
    try {
      const reply = await replyToPost(post.id, {
        username: currentUser.username,
        displayName: currentUser.displayName,
        text,
        replyTo: replyTarget
          ? { id: replyTarget.id, displayName: replyTarget.displayName }
          : null,
      });
      onChange({ replies: [...replies, reply] });
      setReplyText("");
      setReplyTarget(null);
    } catch {
      toast("Could not post your reply — try again.");
    } finally {
      setBusy(false);
    }
  };

  const startReply = (target) => {
    if (!requireAuth()) return;
    setShowReplies(true);
    setReplyTarget(target);
  };

  const handleLikeReply = async (replyId) => {
    if (!requireAuth()) return;
    const target = replies.find((r) => r.id === replyId);
    if (!target) return;
    const replyLikes = target.likes || [];
    const alreadyLiked = replyLikes.includes(currentUser.username);
    const optimistic = replies.map((r) =>
      r.id === replyId
        ? {
            ...r,
            likes: alreadyLiked
              ? replyLikes.filter((u) => u !== currentUser.username)
              : [...replyLikes, currentUser.username],
          }
        : r,
    );
    onChange({ replies: optimistic });
    try {
      const updated = await likeReply(post.id, replyId, currentUser.username);
      onChange({ replies: updated.replies });
    } catch {
      onChange({ replies });
      toast("Could not update like — try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await removePost(post.id, currentUser.username);
      onRemove?.(post.id);
    } catch {
      toast("Could not delete that post — try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        {authorUser?.avatarUrl || authorUser?.avatarGradient ? (
          <Avatar user={authorUser} size={38} className="flex-shrink-0" />
        ) : (
          <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold text-[.85rem] flex-shrink-0">
            {initials(post.displayName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-extrabold text-[.92rem]">
                {post.displayName}
              </div>
              <div className="font-mono text-[.68rem] text-ink-soft dark:text-white/50">
                {time}
              </div>
            </div>
            {canDelete && (
              <button
                onClick={handleDelete}
                aria-label="Delete post"
                className="text-ink-soft dark:text-white/40 hover:text-coral p-1"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {post.text && (
            <p className="mt-2.5 text-[.92rem] whitespace-pre-wrap">
              {post.text}
            </p>
          )}

          {post.image && (
            <div className="mt-3">
              <Image
                src={resolveUploadUrl(post.image.url)}
                alt=""
                width={100}
                height={100}
                rootClassName="rounded-xl overflow-hidden"
                className="border-2 border-line dark:border-white/10"
                style={{ objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {post.document && (
            <>
              <button
                type="button"
                onClick={() => setDocViewerOpen(true)}
                className="mt-3 flex items-center gap-2 bg-[#F1F5FD] dark:bg-white/10 rounded-xl px-3.5 py-2.5 w-fit hover:opacity-85"
              >
                <FileText
                  size={16}
                  className="text-ink-soft dark:text-white/60 shrink-0"
                />
                <span className="text-[.85rem] font-bold truncate max-w-[240px]">
                  {post.document.name}
                </span>
              </button>
              <DocumentViewerModal
                document={post.document}
                open={docViewerOpen}
                onClose={() => setDocViewerOpen(false)}
              />
            </>
          )}

          {(likes.length > 0 || replies.length > 0) && (
            <div className="flex items-center gap-3.5 mt-3.5 text-[.8rem] text-ink-soft dark:text-white/60">
              {likes.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Heart size={13} fill="currentColor" className="text-coral" />
                  {likes.length}
                </span>
              )}
              {replies.length > 0 && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="hover:underline"
                >
                  {replies.length} comment{replies.length === 1 ? "" : "s"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-start gap-4 mt-2 pt-2 border-t-2 border-line dark:border-white/10 font-bold text-[.82rem]">
            <button
              onClick={handleLike}
              className={`w-fit inline-flex items-center gap-1.5 py-1.5 rounded-lg hover:text-violet ${
                liked ? "text-coral" : "text-ink-soft dark:text-white/60"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} /> Like
            </button>
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="w-fit inline-flex items-center gap-1.5 py-1.5 rounded-lg text-ink-soft dark:text-white/60 hover:text-violet"
            >
              <MessageCircle size={16} /> Comment
            </button>
            <button
              onClick={handleReport}
              className={`w-fit inline-flex items-center gap-1.5 py-1.5 rounded-lg hover:text-violet ${
                reported ? "text-coral" : "text-ink-soft dark:text-white/60"
              }`}
            >
              <Flag size={16} fill={reported ? "currentColor" : "none"} />{" "}
              Report
            </button>
          </div>

          {showReplies && (
            <div className="mt-3.5 pt-3.5 border-t-2 border-line dark:border-white/10">
              {comments.length > 0 && (
                <div className="flex flex-col gap-4 mb-3.5">
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      branch={branches.get(c.id) || []}
                      currentUser={currentUser}
                      onLike={handleLikeReply}
                      onStartReply={startReply}
                    />
                  ))}
                </div>
              )}

              {replyTarget && (
                <div className="flex items-center gap-1.5 mb-1.5 text-[.75rem] text-ink-soft dark:text-white/60">
                  Replying to{" "}
                  <span className="font-bold text-violet">
                    @{replyTarget.displayName}
                  </span>
                  <button
                    onClick={() => setReplyTarget(null)}
                    aria-label="Cancel reply"
                    className="hover:text-coral"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                  maxLength={500}
                  placeholder={
                    replyTarget
                      ? `Reply to ${replyTarget.displayName}...`
                      : "Write a comment..."
                  }
                  className="flex-1 bg-white dark:bg-white/5 border-2 border-line dark:border-white/15 dark:text-white rounded-xl px-3 py-2 font-body text-[.88rem] focus:border-violet outline-none"
                />
                <button
                  className="btn btn-dark btn-sm"
                  onClick={handleSubmitComment}
                  disabled={busy}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
