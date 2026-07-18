import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePublicUsers } from "../../context/PublicUsersContext";
import { useToast } from "../../context/ToastContext";
import { listComments, postComment as postCommentApi } from "../../lib/discussionApi";
import { initials } from "../../lib/helpers";
import Avatar from "../common/Avatar";

export default function LessonDiscussion({ course, lesson }) {
  const { currentUser } = useAuth();
  const { getUser } = usePublicUsers();
  const toast = useToast();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    listComments(course.id, lesson.id)
      .then(setComments)
      .catch(() => {});
  }, [course.id, lesson.id]);

  const postComment = async () => {
    const text = input.trim();
    if (!text) return;
    if (!currentUser) {
      toast("Log in to join the discussion!");
      navigate("/account");
      return;
    }
    setInput("");
    try {
      const saved = await postCommentApi(course.id, lesson.id, {
        username: currentUser.username,
        displayName: currentUser.displayName,
        text,
      });
      setComments((prev) => [...prev, saved]);
      setTimeout(() => {
        if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
      }, 0);
    } catch {
      toast("Could not post your comment — try again.");
    }
  };

  return (
    <div className="mt-6 pt-6 border-t-2 border-line dark:border-white/10">
      <h3 className="text-[1.05rem] font-bold mb-3 inline-flex items-center gap-1.5">
        <MessageCircle size={16} /> Discussion{comments.length > 0 ? ` (${comments.length})` : ""}
      </h3>

      <div
        ref={boxRef}
        className="flex flex-col gap-3 max-h-[360px] overflow-y-auto mb-3.5"
      >
        {comments.length === 0 ? (
          <p className="text-ink-soft dark:text-white/50 text-[.88rem]">
            No comments yet — ask a question or share what clicked for you.
          </p>
        ) : (
          comments.map((c, i) => {
            const mine = currentUser && c.username === currentUser.username;
            const authorUser = mine ? currentUser : getUser(c.username);
            const time = new Date(c.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${mine ? "flex-row-reverse ml-auto" : ""}`}
              >
                {authorUser?.avatarUrl || authorUser?.avatarGradient ? (
                  <Avatar user={authorUser} size={32} className="flex-shrink-0" />
                ) : (
                  <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold text-[.72rem] flex-shrink-0">
                    {initials(c.displayName)}
                  </div>
                )}
                <div
                  className={`rounded-xl px-3.5 py-2.5 ${
                    mine
                      ? "bg-indigo-dark dark:bg-violet text-white rounded-tr-[3px]"
                      : "bg-[#F1F5FD] dark:bg-white/10 rounded-tl-[3px]"
                  }`}
                >
                  <div
                    className={`font-extrabold text-[.78rem] mb-0.5 ${
                      mine ? "text-[#BFD0FF]" : "text-indigo-dark dark:text-white"
                    }`}
                  >
                    {c.displayName}
                    <span className="font-mono text-[.62rem] text-[#9AA6C7] ml-2">
                      {time}
                    </span>
                  </div>
                  <span className="text-[.88rem]">{c.text}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && postComment()}
          maxLength={500}
          placeholder="Ask a question or leave a comment..."
          className="flex-1 bg-white dark:bg-white/5 border-2 border-line dark:border-white/15 dark:text-white rounded-xl px-3.5 py-2.5 font-body text-[.9rem] focus:border-violet outline-none"
        />
        <button className="btn btn-dark btn-sm" onClick={postComment}>
          Post
        </button>
      </div>
    </div>
  );
}
