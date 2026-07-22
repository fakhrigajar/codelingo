import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { getSignificantGaps } from "../lib/interviewGaps";
import { listPosts } from "../lib/postApi";
import CourseCard from "../components/courses/CourseCard";
import PostCard from "../components/community/PostCard";
import Avatar from "../components/common/Avatar";
import Banner from "../components/common/Banner";
import ThemeBadge from "../components/common/ThemeBadge";
import FadeIn from "../components/common/FadeIn";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { courses } = useContent();
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
  const favoriteCourses = courses.filter((c) =>
    (currentUser.favorites || []).includes(c.id),
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

  return (
    <div>
      <FadeIn delay={0.05}>
        <div className="relative mb-10">
          <Banner user={currentUser} className="h-60 rounded-3xl mt-8" />
          <Avatar
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 border-bg dark:border-indigo-dark border-4 "
            user={currentUser}
            size={150}
            shape="square"
          />
        </div>
        <div className="flex gap-6 items-center justify-center py-7 flex-wrap">
          <div className="flex flex-col items-center">
            <h1 className="text-[1.9rem]">{currentUser.displayName}</h1>
            <p className="font-mono text-ink-soft dark:text-white/50 text-[1rem]">
              @{currentUser.username}
            </p>
          </div>
        </div>
      </FadeIn>
      <div
        className="grid sm:grid-cols-3 gap-4 my-7 animate-fadeUp"
        style={{ animationDelay: "0.15s" }}
      >
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

      <FadeIn delay={0.25}>
        <h3 className="mt-9">Badges</h3>
        <ThemeBadge />
      </FadeIn>

      <FadeIn delay={0.25}>
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
            {studyingCourses.map((c, index) => (
              <div
                key={c.id}
                className="animate-fadeUp"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
              >
                <CourseCard
                  course={c}
                  currentUser={currentUser}
                  showProgress
                />
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      {favoriteCourses.length > 0 && (
        <FadeIn delay={0.35}>
          <h3 className="mt-9">Favorite courses</h3>
          <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-6 mt-4">
            {favoriteCourses.map((c, index) => (
              <div
                key={c.id}
                className="animate-fadeUp"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
              >
                <CourseCard course={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.35}>
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
            {myPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fadeUp"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
              >
                <PostCard
                  post={post}
                  onChange={(patch) => patchMyPost(post.id, patch)}
                  onRemove={removeMyPost}
                />
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      {significantGaps.length > 0 && (
        <FadeIn delay={0.35}>
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
            {significantGaps.map((gap, index) => (
              <div
                key={gap.title}
                className="flex items-center gap-2 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl px-3.5 py-2 animate-fadeUp"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
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
        </FadeIn>
      )}
    </div>
  );
}
