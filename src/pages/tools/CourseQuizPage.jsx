import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { completedCount } from "../../lib/helpers";
import CourseQuizSetup from "../../components/coursequiz/CourseQuizSetup";
import CourseQuizGame from "../../components/coursequiz/CourseQuizGame";

export default function CourseQuizPage() {
  const { currentUser } = useAuth();
  const { courses } = useContent();
  const [session, setSession] = useState(null); // { course, questions }

  const completedCourses = courses.filter(
    (c) => c.lessons.length > 0 && completedCount(currentUser, c) === c.lessons.length,
  );

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-4"
      >
        <span>Tools</span>
        <span className="text-line dark:text-white/20">/</span>
        <span className="text-ink dark:text-white">Course Quiz</span>
      </nav>

      <span className="eyebrow">
        <Bot size={13} /> AI career tools
      </span>
      <h1 className="text-[2rem]">Course Quiz</h1>
      <p className="text-ink-soft dark:text-white/60 max-w-[640px] mb-6">
        Finish a course to unlock its quiz — AI will generate fresh comprehension questions
        covering everything you learned.
      </p>

      {session ? (
        <CourseQuizGame
          course={session.course}
          questions={session.questions}
          onRestart={() => setSession(null)}
        />
      ) : completedCourses.length === 0 ? (
        <div className="max-w-[560px] mx-auto bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-8 text-center">
          <div className="flex justify-center text-ink-soft dark:text-white/40">
            <Lock size={32} />
          </div>
          <h2 className="text-[1.3rem] mt-3 mb-1.5">No quiz unlocked yet</h2>
          <p className="text-ink-soft dark:text-white/60 text-[.9rem] mb-5">
            Complete every lesson in a course and its quiz will show up here.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse courses
          </Link>
        </div>
      ) : (
        <CourseQuizSetup completedCourses={completedCourses} onReady={setSession} />
      )}
    </div>
  );
}
