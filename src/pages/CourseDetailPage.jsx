import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Navigate,
  Link,
} from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { courseById, lessonById } from "../lib/helpers";
import { getLessonBlocks } from "../lib/lessonBlocks";
import { probeVideoDuration } from "../lib/probeVideoDuration";
import LessonPanel from "../components/courses/LessonPanel";
import AboutPanel from "../components/courses/AboutPanel";
import CourseSidebar from "../components/courses/CourseSidebar";

const ABOUT_ID = "about";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { courses, badges, patchLesson } = useContent();
  const { currentUser, saveCurrentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeLessonId, setActiveLessonId] = useState(ABOUT_ID);

  const course = courseById(courses, courseId);

  const scrollToPanel = () => {
    setTimeout(() => {
      document
        .getElementById("lesson-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    const lessonParam = searchParams.get("lesson");
    if (lessonParam && course && lessonById(course, lessonParam)) {
      setActiveLessonId(lessonParam);
      scrollToPanel();
    } else {
      setActiveLessonId(ABOUT_ID);
    }
  }, [searchParams, course?.id]);

  if (!course) return <Navigate to="/courses" replace />;

  const activeLesson =
    activeLessonId && activeLessonId !== ABOUT_ID
      ? lessonById(course, activeLessonId)
      : null;
  const nextLesson = activeLesson
    ? course.lessons[course.lessons.indexOf(activeLesson) + 1]
    : null;

  const handleOpenLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    scrollToPanel();
  };

  const handleNext = () => {
    handleOpenLesson(nextLesson ? nextLesson.id : ABOUT_ID);
  };

  const handleComplete = (course, lesson, xp, isQuiz) => {
    if (!currentUser) {
      toast("Log in to save your progress!");
      navigate("/account");
      return;
    }
    if (currentUser.completed[course.id]?.includes(lesson.id)) return;

    const updated = {
      ...currentUser,
      completed: {
        ...currentUser.completed,
        [course.id]: [...(currentUser.completed[course.id] || []), lesson.id],
      },
      xp: currentUser.xp + xp,
      badges: [...currentUser.badges],
    };

    const newBadges = [];
    const totalCompleted = Object.values(updated.completed).reduce(
      (a, arr) => a + arr.length,
      0,
    );
    if (totalCompleted === 1 && !updated.badges.includes("first-steps"))
      newBadges.push("first-steps");
    if (isQuiz && !updated.badges.includes("quiz-whiz"))
      newBadges.push("quiz-whiz");
    if (
      updated.completed[course.id].length === course.lessons.length &&
      !updated.badges.includes("course-champion")
    )
      newBadges.push("course-champion");
    const coursesTouched = Object.values(updated.completed).filter(
      (arr) => arr.length > 0,
    ).length;
    if (coursesTouched >= 3 && !updated.badges.includes("triple-threat"))
      newBadges.push("triple-threat");
    updated.badges.push(...newBadges);

    saveCurrentUser(updated);
    const badgeMsg = newBadges.length
      ? ` New badge: ${badges.find((b) => b.id === newBadges[0])?.name}`
      : "";
    toast(`+${xp} XP earned!${badgeMsg}`);
  };

  // Cumulative watch time is per user, per lesson, so it lives on the user
  // record (mirrors how `completed` is namespaced by course id) rather than
  // anywhere on the course/lesson itself.
  const handleVideoProgress = (lessonId, seconds) => {
    if (!currentUser) return;
    const prevForCourse = currentUser.videoProgress?.[course.id] || {};
    if (prevForCourse[lessonId] === seconds) return;
    saveCurrentUser({
      ...currentUser,
      videoProgress: {
        ...(currentUser.videoProgress || {}),
        [course.id]: { ...prevForCourse, [lessonId]: seconds },
      },
    });
  };

  // A video's real duration is only known once it's actually played — once
  // learned, cache it on the lesson so the sidebar/about page's estimated
  // time reflects reality instead of just the admin's written guess.
  const handleVideoDuration = (lessonId, minutes) => {
    const target = lessonById(course, lessonId);
    if (!target || target.videoMinutes === minutes) return;
    patchLesson(course.id, lessonId, { videoMinutes: minutes });
  };

  // The sidebar/about page can only show an accurate estimated time once a
  // video's real duration is known, and that's normally only learned by
  // actually playing it. Rather than making every lesson but the one you've
  // opened look like it has no time estimate, quietly probe every lesson's
  // video in the background (once each, ever — the result is cached on the
  // lesson) so the full course shows real numbers immediately.
  useEffect(() => {
    let cancelled = false;
    const pending = course.lessons
      .filter((l) => l.id !== activeLesson?.id && l.videoMinutes == null)
      .map((l) => ({ id: l.id, videoUrl: getLessonBlocks(l).find((b) => b.type === "video" && b.value)?.value }))
      .filter((l) => l.videoUrl);

    (async () => {
      for (const { id, videoUrl } of pending) {
        if (cancelled) return;
        const seconds = await probeVideoDuration(videoUrl);
        if (cancelled || !seconds) continue;
        handleVideoDuration(id, Math.ceil(seconds / 60));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  return (
    <div className="pt-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <Link to="/courses" className="hover:text-violet dark:hover:text-violet">
          Courses
        </Link>
        <span className="text-line dark:text-white/20">/</span>
        {activeLessonId === ABOUT_ID ? (
          <span className="text-ink dark:text-white">{course.title}</span>
        ) : (
          <>
            <Link
              to={`/courses/${course.id}`}
              className="hover:text-violet dark:hover:text-violet"
            >
              {course.title}
            </Link>
            <span className="text-line dark:text-white/20">/</span>
            <span className="text-ink dark:text-white truncate max-w-[240px]">
              {activeLesson?.title}
            </span>
          </>
        )}
      </nav>

      <div className="grid desktop:grid-cols-[340px_1fr] gap-6 items-start">
        <CourseSidebar
          course={course}
          currentUser={currentUser}
          activeLessonId={activeLessonId}
          onSelect={handleOpenLesson}
        />

        <div id="lesson-panel" className="scroll-mt-24 min-w-0">
          {activeLessonId === ABOUT_ID ? (
            <AboutPanel
              course={course}
              currentUser={currentUser}
              badges={badges}
              onStart={handleOpenLesson}
            />
          ) : (
            activeLesson && (
              <LessonPanel
                course={course}
                lesson={activeLesson}
                currentUser={currentUser}
                onComplete={handleComplete}
                nextLesson={nextLesson}
                onNext={handleNext}
                onVideoProgress={handleVideoProgress}
                onVideoDuration={handleVideoDuration}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
