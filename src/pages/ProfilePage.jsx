import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { useToast } from "../context/ToastContext";
import { initials } from "../lib/helpers";
import { getSignificantGaps } from "../lib/interviewGaps";
import { getBadgeIcon } from "../lib/badgeIcons";
import { listPosts } from "../lib/postApi";
import CourseCard from "../components/courses/CourseCard";
import PostCard from "../components/community/PostCard";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { courses, badges } = useContent();
  const toast = useToast();
  const navigate = useNavigate();

  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    listPosts()
      .then((all) =>
        setMyPosts(all.filter((p) => p.username === currentUser.username)),
      )
      .catch(() => {})
      .finally(() => setPostsLoading(false));
  }, [currentUser]);

  if (!currentUser) return null;

  const totalCompleted = Object.values(currentUser.completed).reduce(
    (a, arr) => a + arr.length,
    0,
  );
  const studyingCourses = courses.filter(
    (c) => (currentUser.completed[c.id] || []).length > 0,
  );
  const significantGaps = getSignificantGaps(currentUser.username);

  const patchMyPost = (id, patch) => {
    setMyPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  };
  const removeMyPost = (id) => {
    setMyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = () => {
    navigate("/");
    logout();
    toast("Logged out. See you soon!");
  };

  return (
    <div>
      <div className="flex gap-6 items-center py-11 pb-7 flex-wrap">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet to-coral flex items-center justify-center text-white text-[2.2rem] font-extrabold">
          {initials(currentUser.displayName)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-[1.9rem]">{currentUser.displayName}</h1>
          <p className="font-mono text-ink-soft dark:text-white/50 text-[.85rem]">
            @{currentUser.username} · age {currentUser.age} · joined{" "}
            {new Date(currentUser.joined).toLocaleDateString()}
          </p>
        </div>
        <button
          className="btn bg-coral border-coral-dark text-white btn-sm"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 my-7">
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">
            {currentUser.xp}
          </b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">
            Total XP
          </span>
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">
            {totalCompleted}
          </b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">
            Lessons completed
          </span>
        </div>
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-center">
          <b className="block font-mono text-[1.7rem] text-indigo-dark dark:text-white">
            {currentUser.badges.length}
          </b>
          <span className="text-[.82rem] text-ink-soft dark:text-white/60">
            Badges earned
          </span>
        </div>
      </div>

      <h3 className="mt-9">Badges</h3>
      <div className="flex gap-3.5 flex-wrap mt-2.5">
        {badges.map((b) => {
          const has = currentUser.badges.includes(b.id);
          const Icon = getBadgeIcon(b.icon);
          return (
            <div
              key={b.id}
              title={b.desc}
              className={`bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl px-4 py-3.5 text-center w-[110px] ${!has ? "opacity-35" : ""}`}
            >
              <div className="flex justify-center text-violet">
                <Icon size={26} />
              </div>
              <div className="text-[.72rem] font-bold mt-1.5 text-ink-soft dark:text-white/60">
                {b.name}
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="mt-9">Course progress</h3>
      {studyingCourses.length === 0 ? (
        <p className="text-ink-soft dark:text-white/50 text-[.9rem] mt-2.5">
          You haven't started any courses yet.{" "}
          <button
            className="text-violet font-bold hover:underline"
            onClick={() => navigate("/courses")}
          >
            Browse courses
          </button>{" "}
          to get going.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6 mt-4">
          {studyingCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              currentUser={currentUser}
              showProgress
            />
          ))}
        </div>
      )}

      <h3 className="mt-9">My posts</h3>
      {postsLoading ? (
        <p className="text-ink-soft dark:text-white/50 text-[.9rem] mt-2.5">
          Loading…
        </p>
      ) : myPosts.length === 0 ? (
        <p className="text-ink-soft dark:text-white/50 text-[.9rem] mt-2.5">
          You haven't posted in the community yet.{" "}
          <Link
            to="/community"
            className="text-violet font-bold hover:underline"
          >
            Say hello
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-5 mt-4">
          {myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onChange={(patch) => patchMyPost(post.id, patch)}
              onRemove={removeMyPost}
            />
          ))}
        </div>
      )}

      {significantGaps.length > 0 && (
        <>
          <h3 className="mt-9">Significant gaps</h3>
          <p className="text-ink-soft dark:text-white/50 text-[.85rem] mt-1 mb-3">
            Topics you've missed most in{" "}
            <Link
              to="/tools/interview-prep"
              className="text-violet font-bold hover:underline"
            >
              Interview Prep
            </Link>{" "}
            quizzes.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {significantGaps.map((gap) => (
              <div
                key={gap.title}
                className="flex items-center gap-2 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl px-3.5 py-2"
              >
                <span className="font-bold text-[.85rem]">{gap.title}</span>
                {gap.count > 1 && (
                  <span className="font-mono text-[.7rem] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-md">
                    ×{gap.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
