import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { getBadgeIcon } from "../../lib/badgeIcons";

// A shield outline (Lucide's "shield" path) rendered large as the badge's
// own shape, instead of a plain rounded rectangle.
const SHIELD_PATH =
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";

function ThemeBadge() {
  const { currentUser } = useAuth();
  const { badges } = useContent();

  if (!currentUser) return null;

  return (
    <div className="flex gap-3.5 flex-wrap mt-2.5">
      {badges.map((b) => {
        const has = currentUser.badges.includes(b.id);
        const Icon = getBadgeIcon(b.icon);
        const gradientId = `badge-gradient-${b.id}`;
        const patternId = `badge-dots-${b.id}`;
        return (
          <div
            key={b.id}
            className="relative group flex flex-col gap-3 w-[100px]"
          >
            <div className={`flex flex-col ${!has ? "opacity-35" : ""}`}>
              <div className="relative w-[100px] h-[112px] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="absolute inset-0 w-full h-full"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFF3C4" />
                      <stop offset="45%" stopColor="#F2C14E" />
                      <stop offset="100%" stopColor="#B9791A" />
                    </linearGradient>
                    <pattern
                      id={patternId}
                      width="3"
                      height="3"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="1"
                        cy="1"
                        r="0.35"
                        fill="rgba(255,255,255,.65)"
                      />
                    </pattern>
                  </defs>
                  <path
                    d={SHIELD_PATH}
                    fill={`url(#${gradientId})`}
                    stroke="#8A5A10"
                    strokeWidth="0.6"
                  />
                  <path
                    d={SHIELD_PATH}
                    fill={`url(#${patternId})`}
                    opacity="0.3"
                  />
                </svg>
                <Icon size={26} className="relative z-10 mb-2" />
              </div>
              <span className="text-center text-[.72rem] font-bold text-ink-soft dark:text-white/60">
                {b.name}
              </span>
            </div>

            <div
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] whitespace-normal rounded-lg bg-indigo-dark dark:bg-white px-2.5 py-1.5 text-center text-[.72rem] font-bold text-white dark:text-indigo-dark opacity-0 translate-y-1 transition-all duration-200 z-20 group-hover:opacity-100 group-hover:translate-y-0"
            >
              {b.desc}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-dark dark:border-t-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ThemeBadge;
