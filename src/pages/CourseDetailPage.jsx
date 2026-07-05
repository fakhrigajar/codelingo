import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { courseById, lessonById, progressPct } from "../lib/helpers";
import LessonPanel from "../components/courses/LessonPanel";
import AboutPanel from "../components/courses/AboutPanel";

const ABOUT_ID = "about";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { courses, badges } = useContent();
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
  const pct = progressPct(currentUser, course);

  const handleOpenLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    scrollToPanel();
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
      ? ` New badge: ${badges.find((b) => b.id === newBadges[0])?.name} 🎉`
      : "";
    toast(`+${xp} XP earned!${badgeMsg}`);
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr_3fr] gap-5">
        <div>
          <div className="flex flex-col gap-3 mt-6">
            <div
              onClick={() => handleOpenLesson(ABOUT_ID)}
              className={`flex items-center bg-white dark:bg-white/5 border-2 rounded-2xl px-4.5 px-[18px] py-4 cursor-pointer transition-colors border-line dark:border-white/10`}
            >
              <div className="font-bold w-full text-center">About</div>
            </div>
            {course.lessons.map((l, i) => {
              const done =
                currentUser &&
                (currentUser.completed[course.id] || []).includes(l.id);
              return (
                <div
                  key={l.id}
                  onClick={() => handleOpenLesson(l.id)}
                  className={`flex items-center gap-4 bg-white dark:bg-white/5 border-2 rounded-2xl px-4.5 px-[18px] py-4 cursor-pointer transition-colors hover:border-violet ${
                    activeLessonId === l.id
                      ? "border-violet"
                      : "border-line dark:border-white/10"
                  }`}
                >
                  <div
                    className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[.9rem] ${
                      done
                        ? "bg-mint border-mint text-white"
                        : "border-line dark:border-white/15"
                    }`}
                  >
                    {done ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M19.5249 6.46434C19.8208 6.75426 19.8256 7.22911 19.5357 7.52495L11.1641 16.0674C10.0858 17.1676 8.31417 17.1676 7.23591 16.0674L4.46434 13.2392C4.17442 12.9434 4.17922 12.4685 4.47505 12.1786C4.77089 11.8887 5.24574 11.8935 5.53566 12.1893L8.30723 15.0175C8.79735 15.5176 9.60265 15.5176 10.0928 15.0175L18.4643 6.47505C18.7543 6.17922 19.2291 6.17442 19.5249 6.46434Z"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold">UNIT {i + 1}:</h1>
                    <h2>{l.title}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div id="lesson-panel" className="scroll-mt-24">
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
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
