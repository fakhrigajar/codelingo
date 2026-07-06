function JSIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#F7DF1E" />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontWeight="800"
        fontSize="24"
        fill="#111111"
      >
        JS
      </text>
    </svg>
  );
}

function TSIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#3178C6" />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontWeight="800"
        fontSize="22"
        fill="#ffffff"
      >
        TS
      </text>
    </svg>
  );
}

function ReactIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#20232A" />
      <g transform="translate(32,32)">
        <circle r="4.2" fill="#61DAFB" />
        <ellipse rx="22" ry="9" fill="none" stroke="#61DAFB" strokeWidth="2.6" />
        <ellipse
          rx="22"
          ry="9"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="2.6"
          transform="rotate(60)"
        />
        <ellipse
          rx="22"
          ry="9"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="2.6"
          transform="rotate(120)"
        />
      </g>
    </svg>
  );
}

function PythonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#FFFFFF" />
      <path
        d="M20 14h14a8 8 0 0 1 8 8v6H24a8 8 0 0 0-8 8v8h-4a6 6 0 0 1-6-6V28a14 14 0 0 1 14-14z"
        fill="#306998"
      />
      <circle cx="25" cy="21" r="2.1" fill="#ffffff" />
      <path
        d="M44 50H30a8 8 0 0 1-8-8v-6h18a8 8 0 0 0 8-8v-8h4a6 6 0 0 1 6 6v10a14 14 0 0 1-14 14z"
        fill="#FFD43B"
      />
      <circle cx="39" cy="43" r="2.1" fill="#111111" />
    </svg>
  );
}

function HTMLIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#E34F26" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontWeight="800"
        fontSize="19"
        fill="#ffffff"
      >
        {"</>"}
      </text>
    </svg>
  );
}

function GitIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#F1502F" />
      <path
        d="M20 40V24"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 32c0 0 8 0 12 0s7 0 7 0"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="45" r="5" fill="#ffffff" />
      <circle cx="20" cy="19" r="5" fill="#ffffff" />
      <circle cx="44" cy="32" r="5" fill="#ffffff" />
    </svg>
  );
}

function DBIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#00B894" />
      <ellipse cx="32" cy="18" rx="14" ry="5.5" fill="#ffffff" />
      <path
        d="M18 18v9a14 5.5 0 0 0 28 0v-9"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        d="M18 27v9a14 5.5 0 0 0 28 0v-9"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        d="M18 36v9a14 5.5 0 0 0 28 0v-9"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
      />
    </svg>
  );
}

function ServerIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#3DDC97" />
      <rect x="14" y="15" width="36" height="13" rx="3" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="21" cy="21.5" r="2" fill="#ffffff" />
      <rect x="14" y="35" width="36" height="13" rx="3" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="21" cy="41.5" r="2" fill="#ffffff" />
    </svg>
  );
}

function AIIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#8C7AE6" />
      <rect x="19" y="19" width="26" height="26" rx="5" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="32" cy="32" r="4.5" fill="#ffffff" />
      <line x1="32" y1="8" x2="32" y2="19" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="45" x2="32" y2="56" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="32" x2="19" y2="32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="32" x2="56" y2="32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function CloudIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#6C5CE7" />
      <g transform="translate(8,10) scale(2)">
        <path
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
}

function monogram(bg, fg, text, fontSize = 20) {
  return function MonogramIcon({ size }) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64">
        <rect width="64" height="64" rx="14" fill={bg} />
        <text
          x="32"
          y="41"
          textAnchor="middle"
          fontFamily="ui-monospace, Menlo, monospace"
          fontWeight="800"
          fontSize={fontSize}
          fill={fg}
        >
          {text}
        </text>
      </svg>
    );
  };
}

const NodeIcon = monogram("#339933", "#ffffff", "node", 14);
const NextIcon = monogram("#000000", "#ffffff", "N", 26);
const JavaIcon = monogram("#E76F00", "#ffffff", "Java", 16);
const CppIcon = monogram("#00599C", "#ffffff", "C++", 17);
const CSharpIcon = monogram("#68217A", "#ffffff", "C#", 22);
const GoIcon = monogram("#00ADD8", "#ffffff", "Go", 24);
const RustIcon = monogram("#2B2B2B", "#F97316", "Rs", 24);
const PHPIcon = monogram("#777BB4", "#ffffff", "PHP", 15);
const SwiftIcon = monogram("#F05138", "#ffffff", "Sw", 22);
const KotlinIcon = monogram("#7F52FF", "#ffffff", "Kt", 24);
const RestApiIcon = monogram("#FF6B5B", "#ffffff", "API", 15);

function VueIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#35495E" />
      <path d="M14 16h9l9 16 9-16h9L32 48Z" fill="#42B883" />
      <path d="M23 16h6l3 5.4 3-5.4h6l-9 15.6Z" fill="#35495E" />
    </svg>
  );
}

function AngularIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#DD0031" />
      <path d="M32 12 50 19 47 42 32 52 17 42 14 19Z" fill="none" stroke="#ffffff" strokeWidth="2.6" />
      <path
        d="M32 20 41 40M32 20 23 40M26.5 33h11"
        stroke="#ffffff"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraphQLIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#E10098" />
      <path
        d="M32 14 50 25v22L32 58 14 47V25Z"
        transform="translate(0,-6) scale(0.9) translate(3.5,3.5)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
      />
      <circle cx="32" cy="16" r="3.4" fill="#ffffff" />
      <circle cx="32" cy="48" r="3.4" fill="#ffffff" />
      <circle cx="16" cy="26" r="3.4" fill="#ffffff" />
      <circle cx="48" cy="26" r="3.4" fill="#ffffff" />
      <circle cx="16" cy="38" r="3.4" fill="#ffffff" />
      <circle cx="48" cy="38" r="3.4" fill="#ffffff" />
    </svg>
  );
}

function RubyIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#CC342D" />
      <rect
        x="21"
        y="21"
        width="22"
        height="22"
        rx="2"
        fill="#ffffff"
        transform="rotate(45 32 32)"
      />
      <line
        x1="32"
        y1="19"
        x2="32"
        y2="45"
        stroke="#CC342D"
        strokeWidth="2"
        transform="rotate(45 32 32)"
      />
      <line
        x1="19"
        y1="32"
        x2="45"
        y2="32"
        stroke="#CC342D"
        strokeWidth="2"
        transform="rotate(45 32 32)"
      />
    </svg>
  );
}

function FlutterIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#02569B" />
      <path d="M20 38 40 18h10L30 48Z" fill="#54C5F8" />
      <path d="M30 48 40 38h10L40 48Z" fill="#01579B" />
      <path d="M20 38 30 48h10L30 28Z" fill="#ffffff" />
    </svg>
  );
}

function TestingIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#16A085" />
      <rect x="16" y="14" width="32" height="36" rx="4" fill="none" stroke="#ffffff" strokeWidth="2.8" />
      <path
        d="M22 24h14M22 31h14M22 38h9"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="44" cy="42" r="11" fill="#16A085" stroke="#ffffff" strokeWidth="2.6" />
      <path d="M39 42l3.5 3.5L49 39" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CyberIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#2C3E50" />
      <path
        d="M32 12 48 18v13c0 11-7 18-16 21-9-3-16-10-16-21V18Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.8"
      />
      <circle cx="32" cy="32" r="4.5" fill="#ffffff" />
      <path d="M32 36.5V42" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function DSAIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#E67E22" />
      <path
        d="M32 20V30M32 30 20 42M32 30 44 42"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="32" cy="16" r="5.5" fill="#ffffff" />
      <circle cx="20" cy="46" r="5.5" fill="#ffffff" />
      <circle cx="44" cy="46" r="5.5" fill="#ffffff" />
    </svg>
  );
}

function SystemDesignIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#34495E" />
      <rect x="12" y="14" width="16" height="12" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="2.6" />
      <rect x="36" y="14" width="16" height="12" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="2.6" />
      <rect x="24" y="38" width="16" height="12" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="2.6" />
      <path
        d="M20 26v6h24v-6M32 32v6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS = {
  javascript: JSIcon,
  "react-js": ReactIcon,
  "backend-development": ServerIcon,
  "intro-to-ai": AIIcon,
  "html-css": HTMLIcon,
  python: PythonIcon,
  typescript: TSIcon,
  "databases-sql": DBIcon,
  "git-version-control": GitIcon,
  "devops-cloud": CloudIcon,
  nodejs: NodeIcon,
  vuejs: VueIcon,
  angular: AngularIcon,
  nextjs: NextIcon,
  java: JavaIcon,
  cpp: CppIcon,
  csharp: CSharpIcon,
  go: GoIcon,
  rust: RustIcon,
  php: PHPIcon,
  ruby: RubyIcon,
  swift: SwiftIcon,
  kotlin: KotlinIcon,
  flutter: FlutterIcon,
  graphql: GraphQLIcon,
  "rest-api-design": RestApiIcon,
  "software-testing": TestingIcon,
  cybersecurity: CyberIcon,
  "data-structures-algorithms": DSAIcon,
  "system-design": SystemDesignIcon,
};

export default function CourseIcon({ course, size = 64, className = "" }) {
  const Icon = ICONS[course.id];

  if (Icon) {
    return (
      <div className={className}>
        <Icon size={size} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-[14px] ${className}`}
      style={{ width: size, height: size, background: course.color }}
    >
      <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{course.icon}</span>
    </div>
  );
}
