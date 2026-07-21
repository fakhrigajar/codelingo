import { useNavigate } from "react-router-dom";
import { Heart, BookOpen, ArrowUpRight } from "lucide-react";
import { progressPct, shadeColor } from "../../lib/helpers";
import { getLessonMinutes } from "../../lib/lessonBlocks";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ThemedButton from "../common/ThemedButton";
import CourseIcon from "./CourseIcon";

export default function CourseCard({
  course,
  currentUser,
  showProgress = false,
  interactive = true,
}) {
  const navigate = useNavigate();
  const { saveCurrentUser } = useAuth();
  const toast = useToast();
  const pct = progressPct(currentUser, course);
  const comingSoon = course.availability === "coming-soon";
  const titleColor = shadeColor(course.color, -12);
  const hours = Math.round(
    course.lessons.reduce((sum, l) => sum + getLessonMinutes(l), 0) / 60,
  );
  const isFavorite = (currentUser?.favorites || []).includes(course.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast("Log in to save favorites!");
      navigate("/account");
      return;
    }
    const favorites = currentUser.favorites || [];
    saveCurrentUser({
      ...currentUser,
      favorites: isFavorite
        ? favorites.filter((id) => id !== course.id)
        : [...favorites, course.id],
    });
    toast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div
      onClick={
        interactive
          ? () => !comingSoon && navigate(`/courses/${course.id}`)
          : undefined
      }
      className={`relative rounded-[28px] overflow-hidden bg-panel dark:bg-indigo-dark border-2 border-line dark:border-white/10 transition-all flex flex-col ${
        comingSoon ? "opacity-80" : ""
      } ${
        interactive && !comingSoon
          ? "cursor-pointer hover:shadow-card"
          : "cursor-default"
      }`}
    >
      <div
        className={`relative h-36 shrink-0 flex items-center justify-center ${comingSoon ? "" : ""}`}
        style={{
          background: `linear-gradient(160deg, ${course.color}26 0%, ${course.color}4D 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(${course.color}66 1.5px, transparent 1.5px)`,
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-8 -top-10 w-32 h-32 rounded-full blur-2xl"
          style={{ background: `${course.color}40` }}
          aria-hidden="true"
        />
        <CourseIcon
          course={course}
          size={64}
          className="relative rounded-2xl shadow-lg"
        />
        {interactive && (
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={isFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-indigo-dark shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              size={16}
              className={
                isFavorite
                  ? "text-coral"
                  : "text-ink-soft/50 dark:text-white/40"
              }
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        )}
        {comingSoon && (
          <div className="absolute top-0 inset-x-0 bg-sun text-ink text-center text-[.62rem] font-bold uppercase tracking-wide py-1">
            Coming soon
          </div>
        )}
        <div className="absolute -bottom-4 right-4 bg-white dark:bg-indigo-dark rounded-full pl-2 pr-3 py-1.5 flex items-center gap-1.5">
          <BookOpen size={13} style={{ color: course.color }} />
          <span className="text-ink dark:text-white text-[.78rem] font-extrabold">
            {course.lessons.length} lessons
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-6 pb-5">
        <h3
          className="text-[1.2rem] font-extrabold leading-tight mb-1 truncate"
          style={{ color: titleColor }}
        >
          {course.title}
        </h3>
        <p className="text-ink-soft dark:text-white/50 text-[.85rem] font-bold mb-2">
          {course.level}
        </p>

        {!comingSoon && (showProgress || currentUser) && (
          <div className="mb-3">
            <div className="h-1.5 bg-line dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-mint rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[.65rem] text-ink-soft dark:text-white/40 mt-1.5">
              {pct}% complete
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-dashed border-line dark:border-white/10">
          <div>
            <span className="block text-ink dark:text-white text-[1.15rem] font-extrabold leading-none">
              {hours > 0 ? `${hours}h` : "—"}
            </span>
            <span className="text-ink-soft dark:text-white/50 text-[.68rem]">
              est. time
            </span>
          </div>
          <ThemedButton
            type="button"
            disabled={!interactive || comingSoon}
            className={`inline-flex items-center gap-1.5 text-white font-extrabold text-[.85rem] rounded-full px-4 py-2.5 shrink-0 transition-transform disabled:pointer-events-none`}
            style={{
              background: course.color,
            }}
          >
            {comingSoon ? "Notify me" : "Start course"}
            <ArrowUpRight size={15} />
          </ThemedButton>
        </div>
      </div>
    </div>
  );
}
