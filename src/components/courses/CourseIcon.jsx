export function isImageIcon(icon) {
  return typeof icon === "string" && (icon.startsWith("data:image") || /^https?:\/\//.test(icon));
}

export default function CourseIcon({ course, size = 64, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-[14px] ${className}`}
      style={{ width: size, height: size, background: course.color }}
    >
      {isImageIcon(course.icon) ? (
        <img src={course.icon} alt="" className="w-full h-full object-cover" />
      ) : (
        <span
          className="font-display font-extrabold text-white/90"
          style={{ fontSize: size * 0.42, lineHeight: 1 }}
        >
          {course.title?.trim()[0]?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
