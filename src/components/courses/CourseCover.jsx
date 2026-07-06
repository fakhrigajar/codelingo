import { shadeColor } from "../../lib/helpers";
import CourseIcon from "./CourseIcon";

export default function CourseCover({ course, className = "", iconSize = 56 }) {
  const dark = shadeColor(course.color, -30);

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${course.color} 0%, ${dark} 100%)`,
      }}
    >
      <div
        className="absolute -right-6 -top-10 w-32 h-32 rounded-full bg-white/15"
        aria-hidden="true"
      />
      <div
        className="absolute -left-8 -bottom-12 w-28 h-28 rounded-full bg-black/10"
        aria-hidden="true"
      />
      <CourseIcon
        course={course}
        size={iconSize}
        className="relative rounded-2xl shadow-lg overflow-hidden"
      />
    </div>
  );
}
