import {
  Code2,
  Award,
  Heart,
  MessageCircle,
  CheckCircle2,
  Flame,
} from "lucide-react";
import figmaIcon from "../../assets/logos/figma-icon.png";
import vscIcon from "../../assets/logos/vsc-icon.png";
import nodeIcon from "../../assets/logos/nodejs-icon.png";
import pythonIcon from "../../assets/logos/python-icon.png";
import csIcon from "../../assets/logos/cs-icon.png";
import typescriptIcon from "../../assets/logos/typescript-icon.png";
import { delay } from "framer-motion";

const CARD =
  "bg-panel dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl shadow-card";

// Every card below takes a size="md" | "sm" prop — "md" matches the original
// desktop dimensions exactly, "sm" is a tighter preset for tablet/mobile.
// Content (icon size, font sizes, padding) scales with it, not just a CSS
// transform, so text stays crisp at small sizes.

const COURSE_SIZES = {
  md: {
    box: "w-[188px] p-3.5",
    iconBox: "w-8 h-8",
    iconSize: 16,
    title: "text-[.8rem]",
    caption: "text-[.65rem]",
    gap: "gap-2 mb-2.5",
    barMt: "mt-1.5",
  },
  sm: {
    box: "w-[150px] p-2.5",
    iconBox: "w-7 h-7",
    iconSize: 13,
    title: "text-[.7rem]",
    caption: "text-[.58rem]",
    gap: "gap-1.5 mb-2",
    barMt: "mt-1",
  },
};

function CourseSnippet({ size = "md" }) {
  const s = COURSE_SIZES[size];
  return (
    <div className={`${CARD} ${s.box}`}>
      <div className={`flex items-center ${s.gap}`}>
        <div
          className={`${s.iconBox} rounded-lg bg-violet/15 flex items-center justify-center text-violet shrink-0`}
        >
          <Code2 size={s.iconSize} />
        </div>
        <div className="min-w-0">
          <p className={`${s.title} font-bold leading-tight m-0 truncate`}>
            JavaScript Basics
          </p>
          <p
            className={`${s.caption} font-mono text-ink-soft dark:text-white/50 m-0`}
          >
            8 lessons
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-line dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-mint rounded-full w-[72%]" />
      </div>
      <p
        className={`${s.caption} font-mono text-ink-soft dark:text-white/50 ${s.barMt} mb-0`}
      >
        72% complete
      </p>
    </div>
  );
}

const BADGE_SIZES = {
  md: {
    box: "w-[184px] p-3.5 gap-2.5",
    iconBox: "w-10 h-10",
    iconSize: 20,
    title: "text-[.78rem]",
    caption: "text-[.68rem]",
  },
  sm: {
    box: "w-[146px] p-2.5 gap-2",
    iconBox: "w-8 h-8",
    iconSize: 16,
    title: "text-[.66rem]",
    caption: "text-[.58rem]",
  },
};

function BadgeSnippet({ size = "md" }) {
  const s = BADGE_SIZES[size];
  return (
    <div className={`${CARD} ${s.box} flex items-center`}>
      <div
        className={`${s.iconBox} rounded-full bg-sun/25 flex items-center justify-center text-[#9A6B00] dark:text-sun shrink-0`}
      >
        <Award size={s.iconSize} />
      </div>
      <div className="min-w-0">
        <p
          className={`${s.title} font-bold leading-tight m-0 whitespace-nowrap`}
        >
          Badge unlocked!
        </p>
        <p className={`${s.caption} font-mono text-mint m-0 whitespace-nowrap`}>
          First Steps
        </p>
      </div>
    </div>
  );
}

const COMMUNITY_SIZES = {
  md: {
    box: "w-[206px] p-3.5",
    avatar: "w-7 h-7 text-[.62rem]",
    name: "text-[.75rem]",
    body: "text-[.72rem] mb-2.5",
    footerIcon: 12,
    footerText: "text-[.68rem]",
  },
  sm: {
    box: "w-[164px] p-2.5",
    avatar: "w-6 h-6 text-[.54rem]",
    name: "text-[.66rem]",
    body: "text-[.62rem] mb-2",
    footerIcon: 11,
    footerText: "text-[.58rem]",
  },
};

function CommunitySnippet({ size = "md" }) {
  const s = COMMUNITY_SIZES[size];
  return (
    <div className={`${CARD} ${s.box}`}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`${s.avatar} rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center text-white font-extrabold shrink-0`}
        >
          AK
        </div>
        <p className={`${s.name} font-bold m-0`}>alex_k</p>
      </div>
      <p
        className={`${s.body} text-ink-soft dark:text-white/60 leading-snug m-0`}
      >
        Finally finished my first React app 🎉
      </p>
      <div
        className={`flex items-center gap-3 ${s.footerText} font-mono text-ink-soft dark:text-white/50`}
      >
        <span className="flex items-center gap-1">
          <Heart
            size={s.footerIcon}
            fill="currentColor"
            className="text-coral"
          />{" "}
          24
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={s.footerIcon} /> 6
        </span>
      </div>
    </div>
  );
}

const QUIZ_SIZES = {
  md: {
    box: "w-[172px] p-3.5",
    headerMb: "mb-2.5",
    title: "text-[.78rem]",
    badge: "text-[.68rem]",
    badgeIcon: 13,
  },
  sm: {
    box: "w-[138px] p-2.5",
    headerMb: "mb-2",
    title: "text-[.68rem]",
    badge: "text-[.58rem]",
    badgeIcon: 11,
  },
};

function QuizSnippet({ size = "md" }) {
  const s = QUIZ_SIZES[size];
  return (
    <div className={`${CARD} ${s.box}`}>
      <div className={`flex items-center justify-between ${s.headerMb}`}>
        <p className={`${s.title} font-bold m-0`}>Quiz complete</p>
        <span
          className={`${s.badge} font-mono font-bold text-mint flex items-center gap-1`}
        >
          <CheckCircle2 size={s.badgeIcon} /> 4/4
        </span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-mint" />
        ))}
      </div>
    </div>
  );
}

const STREAK_SIZES = {
  md: { pad: "px-3.5 py-2", icon: 14, text: "text-[.72rem]" },
  sm: { pad: "px-2.5 py-1.5", icon: 12, text: "text-[.62rem]" },
};

function StreakChip({ size = "md" }) {
  const s = STREAK_SIZES[size];
  return (
    <div
      className={`${CARD} inline-flex items-center gap-1.5 rounded-full ${s.pad}`}
    >
      <Flame size={s.icon} className="text-coral" />
      <span
        className={`${s.text} font-mono font-bold text-indigo-dark dark:text-white`}
      >
        5-day streak
      </span>
    </div>
  );
}

function IconBadge({ src, alt, size = 62 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className="select-none drop-shadow-[0_14px_22px_rgba(27,38,71,.4)]"
      style={{ width: size, height: size }}
    />
  );
}

function Floater({
  node,
  pos,
  tilt,
  anim = "animate-logoFloat",
  delay,
  dur,
  appearDelay,
}) {
  return (
    <div
      className={`pointer-events-auto absolute ${pos} animate-heroPop`}
      style={{ animationDelay: appearDelay }}
    >
      <div
        className={anim}
        style={{ animationDelay: delay, animationDuration: dur }}
      >
        <div className={`${tilt} transition-transform duration-300`}>
          {node}
        </div>
      </div>
    </div>
  );
}

const CARDS = [
  {
    node: <CourseSnippet />,
    pos: "top-[10%] left-8",
    tilt: "-rotate-6",
    anim: "animate-cardFloat",
    delay: "0s",
    dur: "5.5s",
  },
  {
    node: <BadgeSnippet />,
    pos: "top-[20%] right-0",
    tilt: "rotate-6",
    anim: "animate-cardFloat",
    delay: ".6s",
    dur: "5s",
  },
  {
    node: <CommunitySnippet />,
    pos: "bottom-[7%] left-[3%]",
    tilt: "rotate-3",
    anim: "animate-cardFloat",
    delay: "1.1s",
    dur: "6s",
  },
  {
    node: <QuizSnippet />,
    pos: "bottom-[4%] right-[1%]",
    tilt: "-rotate-6",
    anim: "animate-cardFloat",
    delay: ".3s",
    dur: "5.2s",
  },
  {
    node: <StreakChip />,
    pos: "top-[42%] left-[1%]",
    tilt: "-rotate-3",
    anim: "animate-cardFloat",
    delay: "1.6s",
    dur: "4.6s",
  },
];

const LOGOS = [
  {
    node: <IconBadge src={vscIcon} alt="VS Code" size={66} />,
    pos: "top-[25%] left-[17%]",
    tilt: "-rotate-[10deg]",
    delay: ".2s",
    dur: "6.2s",
  },
  {
    node: <IconBadge src={pythonIcon} alt="Python" size={62} />,
    pos: "top-[59%] left-[13%]",
    tilt: "rotate-[8deg]",
    delay: "1.4s",
    dur: "5.8s",
  },
  {
    node: <IconBadge src={nodeIcon} alt="Node.js" size={56} />,
    pos: "bottom-0 left-[24%]",
    tilt: "rotate-[6deg]",
    delay: "2.1s",
    dur: "5.6s",
  },
  {
    node: <IconBadge src={csIcon} alt="C#" size={62} />,
    pos: "top-[10%] right-[20%]",
    tilt: "rotate-[9deg]",
    delay: ".8s",
    dur: "6s",
  },
  {
    node: <IconBadge src={typescriptIcon} alt="TypeScript" size={75} />,
    pos: "top-[50%] right-[7%]",
    tilt: "-rotate-[9deg]",
    delay: "1.9s",
    dur: "5.4s",
  },
  {
    node: <IconBadge src={figmaIcon} alt="Figma" size={63} />,
    pos: "bottom-[15%] right-[20%]",
    tilt: "-rotate-[7deg]",
    delay: "1s",
    dur: "6.4s",
  },
];

const TABLET_ITEMS = [
  // {
  //   node: <CourseSnippet size="sm" />,
  //   pos: "top-[4%] left-[3%]",
  //   tilt: "-rotate-6",
  //   anim: "animate-cardFloat",
  //   delay: "0s",
  //   dur: "5.5s",
  // },
  // {
  //   node: <QuizSnippet size="sm" />,
  //   pos: "top-[5%] right-[3%]",
  //   tilt: "rotate-6",
  //   anim: "animate-cardFloat",
  //   delay: ".4s",
  //   dur: "5.2s",
  // },
  // {
  //   node: <IconBadge src={pythonIcon} alt="Python" size={52} />,
  //   pos: "bottom-[5%] left-[4%]",
  //   tilt: "rotate-[6deg]",
  //   delay: "1.5s",
  //   dur: "6.2s",
  // },
  // {
  //   node: <IconBadge src={typescriptIcon} alt="TypeScript" size={56} />,
  //   pos: "bottom-[3%] right-[3%]",
  //   tilt: "-rotate-[7deg]",
  //   delay: ".8s",
  //   dur: "5.8s",
  // },
  {
    node: <CourseSnippet size="sm" />,
    pos: "top-10 left-[70%]",
    tilt: "rotate-6",
    anim: "animate-cardFloat",
    delay: ".5s",
    dur: "5.8s",
  },
  {
    node: <IconBadge src={vscIcon} alt="VS Code" size={60} />,
    pos: "top-[22%] right-[75%]",
    delay: "1s",
    dur: "6s",
  },
  {
    node: <IconBadge src={pythonIcon} alt="Python" size={70} />,
    pos: "top-[7%] left-[40%]",
  },
  {
    node: <IconBadge src={nodeIcon} alt="Node JS" />,
    pos: "bottom-[120px] left-[80%]",
    delay: "4s",
  },
  {
    node: <IconBadge src={typescriptIcon} alt="Typescript" />,
    pos: "bottom-[120px] right-[80%]",
  },
];

const MOBILE_ITEMS = [
  {
    node: <IconBadge src={vscIcon} alt="TypeScript" size={55} />,
    pos: "top-[8%] left-[10%]",
    delay: "1s",
    dur: "6s",
  },
  {
    node: <IconBadge src={pythonIcon} alt="Python" size={70} />,
    pos: "-bottom-10 right-[10%]",
    delay: "3s",
  },
  {
    node: <IconBadge src={figmaIcon} alt="Figma" size={70} />,
    pos: "-bottom-5 left-[10%]",
    delay: "5s",
  },
  { node: <QuizSnippet size="sm" />, pos: "top-[10%] right-[10%]" },
];

const APPEAR_STEP = 0.08;

export default function HeroFloatingLayer() {
  return (
    <>
      <div
        className="block sm:hidden absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {MOBILE_ITEMS.map((item, i) => (
          <Floater
            key={`mobile-${i}`}
            {...item}
            appearDelay={`${i * APPEAR_STEP}s`}
          />
        ))}
      </div>

      <div
        className="hidden sm:block desktop:hidden absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {TABLET_ITEMS.map((item, i) => (
          <Floater
            key={`tablet-${i}`}
            {...item}
            appearDelay={`${i * APPEAR_STEP}s`}
          />
        ))}
      </div>

      <div
        className="hidden desktop:block relative max-w-[1020px] mx-auto h-full pointer-events-none"
        aria-hidden="true"
      >
        {CARDS.map((item, i) => (
          <Floater
            key={`card-${i}`}
            {...item}
            appearDelay={`${i * APPEAR_STEP}s`}
          />
        ))}
        {LOGOS.map((item, i) => (
          <Floater
            key={`logo-${i}`}
            {...item}
            appearDelay={`${(CARDS.length + i) * APPEAR_STEP}s`}
          />
        ))}
      </div>
    </>
  );
}
