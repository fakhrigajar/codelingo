import { initials } from "../../lib/helpers";

// Shows a user's uploaded profile photo, falling back to the initials
// bubble everywhere in the app already used before avatars existed.
export default function Avatar({ user, size = 40, shape = "circle", className = "" }) {
  const px = typeof size === "number" ? `${size}px` : size;
  const shapeClass = shape === "square" ? "rounded-3xl" : "rounded-full";

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${shapeClass} object-cover shrink-0 border-2 border-line dark:border-white/15 ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <span
      className={`${shapeClass} flex items-center justify-center text-white font-extrabold shrink-0 border-2 border-line dark:border-white/15 ${
        user?.avatarGradient ? "" : "bg-gradient-to-br from-violet to-coral"
      } ${className}`}
      style={{
        width: px,
        height: px,
        fontSize: `calc(${px} * 0.38)`,
        ...(user?.avatarGradient ? { background: user.avatarGradient } : {}),
      }}
    >
      {initials(user?.displayName)}
    </span>
  );
}
