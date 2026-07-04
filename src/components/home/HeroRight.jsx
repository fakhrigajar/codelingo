import React from "react";

export default function HeroRight({ size = 300 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      <svg
        // className="bg-red-700"
        viewBox="100 20 300 480"
        width={size}
        height={size * (480 / 300)}
        role="img"
        aria-label="Cheerful 3D robot holding an open book with a glowing lightbulb idea"
        style={{ overflow: "visible", maxWidth: "100%", height: "auto" }}
      >
        <style>{`
          @keyframes floatBob {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50%      { transform: translateY(-12px) rotate(-1.2deg); }
          }
          @keyframes blink {
            0%, 92%, 100% { transform: scaleY(1); }
            96%           { transform: scaleY(0.08); }
          }
          @keyframes bulbGlow {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.08); }
          }
          @keyframes chestPulse {
            0%, 100% { opacity: 0.55; transform: scale(0.92); }
            50%      { opacity: 1;    transform: scale(1.06); }
          }
          @keyframes sparkTwinkle {
            0%, 100% { opacity: 0.25; transform: scale(0.8); }
            50%      { opacity: 1;    transform: scale(1.15); }
          }
          @keyframes earWiggle {
            0%, 100% { transform: rotate(0deg); }
            50%      { transform: rotate(4deg); }
          }

          .robot   { animation: floatBob 4.5s ease-in-out infinite;
                     transform-origin: 210px 240px; }
          .eyeOpen { animation: blink 5s ease-in-out infinite;
                     transform-box: fill-box; transform-origin: center; }
          .bulbGlow{ animation: bulbGlow 2.4s ease-in-out infinite;
                     transform-box: fill-box; transform-origin: center; }
          .chest   { animation: chestPulse 2.8s ease-in-out infinite;
                     transform-box: fill-box; transform-origin: center; }
          .spark   { animation: sparkTwinkle 1.8s ease-in-out infinite;
                     transform-box: fill-box; transform-origin: center; }
          .spark.s2{ animation-delay: .2s; }
          .spark.s3{ animation-delay: .4s; }
          .spark.s4{ animation-delay: .6s; }
          .spark.s5{ animation-delay: .8s; }
          .spark.s6{ animation-delay: 1s; }
          .spark.s7{ animation-delay: 1.2s; }
          .earL    { animation: earWiggle 3.6s ease-in-out infinite;
                     transform-box: fill-box; transform-origin: bottom right; }
          .earR    { animation: earWiggle 3.6s ease-in-out infinite reverse;
                     transform-box: fill-box; transform-origin: bottom left; }

          @media (prefers-reduced-motion: reduce) {
            .robot, .eyeOpen, .bulbGlow, .chest, .spark, .earL, .earR {
              animation: none !important;
            }
          }
        `}</style>

        <defs>
          <linearGradient id="head" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#eef1f6" />
            <stop offset="100%" stopColor="#c7cedd" />
          </linearGradient>
          <radialGradient id="headShine" cx="32%" cy="26%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="screen" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#20304f" />
            <stop offset="60%" stopColor="#111c33" />
            <stop offset="100%" stopColor="#0a1122" />
          </radialGradient>

          <linearGradient id="blueBright" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a9d2ff" />
            <stop offset="50%" stopColor="#4f97f5" />
            <stop offset="100%" stopColor="#2668d6" />
          </linearGradient>

          <linearGradient id="bodyWhite" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c9d2e2" />
          </linearGradient>

          <radialGradient id="chestGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#d6ecff" />
            <stop offset="45%" stopColor="#4aa3ff" />
            <stop offset="100%" stopColor="#1667d6" />
          </radialGradient>

          <linearGradient id="bookCover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f97f5" />
            <stop offset="100%" stopColor="#1f5fd0" />
          </linearGradient>
          <linearGradient id="pageL" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d5dceb" />
          </linearGradient>
          <linearGradient id="pageR" x1="1" y1="0" x2="0" y2="0.3">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d5dceb" />
          </linearGradient>

          <radialGradient id="bulbHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd66b" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ffb02e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffb02e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bulbGlass" cx="42%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff2c4" />
            <stop offset="45%" stopColor="#ffc23a" />
            <stop offset="100%" stopColor="#f59214" />
          </radialGradient>
          <linearGradient id="screw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef1f4" />
            <stop offset="50%" stopColor="#aeb6c2" />
            <stop offset="100%" stopColor="#7c8593" />
          </linearGradient>

          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1b3a6b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#1b3a6b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="215" cy="452" rx="140" ry="24" fill="url(#floorShadow)" />

        <g className="robot">
          <g>
            <path
              d="M300 300 q70 -6 78 40 q6 40 -34 58 q-30 12 -46 -14 q-16 -30 2 -84z"
              fill="url(#blueBright)"
            />
            <path
              d="M188 288
                 q88 -34 148 22
                 q46 46 30 108
                 q-14 56 -84 66
                 q-64 10 -108 -34
                 q-40 -42 -28 -100
                 q10 -46 42 -62z"
              fill="url(#bodyWhite)"
            />
            <path
              d="M188 288
                 q88 -34 148 22
                 q40 40 32 92
                 q-70 26 -132 6
                 q-46 -16 -78 -54
                 q10 -46 30 -66z"
              fill="url(#bodyBlue)"
            />

            <circle cx="246" cy="330" r="30" fill="#0f4fae" />
            <circle
              className="chest"
              cx="246"
              cy="330"
              r="24"
              fill="url(#chestGlow)"
            />
            <circle cx="238" cy="322" r="6" fill="#ffffff" opacity="0.85" />
          </g>

          <g transform="rotate(-11 250 150)">
            <ellipse
              cx="150"
              cy="188"
              rx="26"
              ry="30"
              fill="url(#blue)"
              transform="rotate(-8 150 188)"
            />
            <ellipse
              cx="356"
              cy="176"
              rx="26"
              ry="32"
              fill="url(#blue)"
              transform="rotate(8 356 176)"
            />

            <rect
              x="150"
              y="70"
              width="212"
              height="168"
              rx="52"
              fill="url(#head)"
            />
            <rect
              x="150"
              y="70"
              width="212"
              height="168"
              rx="52"
              fill="url(#headShine)"
            />

            <rect
              x="182"
              y="98"
              width="150"
              height="112"
              rx="30"
              fill="url(#screen)"
            />

            <g
              stroke="#5fe0ff"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M198 120 v-8 a6 6 0 0 1 6 -6 h8" />
              <path d="M316 120 v-8 a6 6 0 0 0 -6 -6 h-8" />
              <path d="M198 190 v8 a6 6 0 0 0 6 6 h8" />
              <path d="M316 190 v8 a6 6 0 0 1 -6 6 h-8" />
            </g>

            <ellipse
              className="eyeOpen"
              cx="232"
              cy="156"
              rx="17"
              ry="22"
              fill="#5fe0ff"
            />
            <circle cx="226" cy="149" r="5" fill="#d7f8ff" opacity="0.9" />
            <path
              d="M278 162 q14 -22 34 0"
              fill="none"
              stroke="#5fe0ff"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>

          <g transform="rotate(-6 150 340)">
            <path d="M60 322 l86 20 l-4 96 l-88 -20z" fill="url(#bookCover)" />
            <path d="M232 322 l-86 20 l4 96 l88 -20z" fill="url(#bookCover)" />
            <path d="M70 318 l76 22 l-4 84 l-78 -20z" fill="url(#pageL)" />
            <path d="M222 318 l-76 22 l4 84 l78 -20z" fill="url(#pageR)" />
            <g stroke="#c3ccdd" strokeWidth="3" strokeLinecap="round">
              <path d="M84 336 l44 12" />
              <path d="M82 348 l44 12" />
              <path d="M208 336 l-44 12" />
              <path d="M210 348 l-44 12" />
            </g>
            <path d="M146 340 l0 84" stroke="#8fb4ef" strokeWidth="4" />

            <g transform="translate(146 300)">
              <circle
                className="bulbGlow"
                cx="0"
                cy="-40"
                r="58"
                fill="url(#bulbHalo)"
                filter="url(#soft)"
              />

              <g stroke="#ffb02e" strokeWidth="6" strokeLinecap="round">
                <line className="spark s1" x1="0" y1="-104" x2="0" y2="-90" />
                <line
                  className="spark s2"
                  x1="-42"
                  y1="-92"
                  x2="-33"
                  y2="-80"
                />
                <line className="spark s3" x1="42" y1="-92" x2="33" y2="-80" />
                <line
                  className="spark s4"
                  x1="-64"
                  y1="-56"
                  x2="-52"
                  y2="-50"
                />
                <line className="spark s5" x1="64" y1="-56" x2="52" y2="-50" />
                <line
                  className="spark s6"
                  x1="-70"
                  y1="-20"
                  x2="-58"
                  y2="-22"
                />
                <line className="spark s7" x1="70" y1="-20" x2="58" y2="-22" />
              </g>

              <path
                d="M0 -84
                   a38 38 0 0 1 22 68
                   q-8 8 -8 18 l-28 0 q0 -10 -8 -18
                   a38 38 0 0 1 22 -68z"
                fill="url(#bulbGlass)"
              />
              <path
                d="M-11 -34 q11 -18 22 0 M-6 -34 q6 14 12 0"
                fill="none"
                stroke="#c9560a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M-14 -60 q-8 14 2 30"
                fill="none"
                stroke="#fff6d8"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.8"
              />

              <g fill="url(#screw)">
                <rect x="-15" y="1" width="30" height="9" rx="3" />
                <rect x="-14" y="11" width="28" height="8" rx="3" />
                <rect x="-12" y="20" width="24" height="8" rx="3" />
              </g>
              <path d="M-8 29 h16 l-8 8z" fill="#7c8593" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
