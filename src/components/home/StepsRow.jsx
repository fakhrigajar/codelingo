import { useId, useLayoutEffect, useRef, useState } from "react";

function useConnectorPaths(containerRef, iconRefs, count) {
  const [paths, setPaths] = useState([]);

  useLayoutEffect(() => {
    let cancelled = false;
    let ro;
    let rafId;

    const measure = (container) => {
      const icons = iconRefs.current.slice(0, count);
      if (icons.some((el) => !el)) return;
      const cRect = container.getBoundingClientRect();
      const rects = icons.map((el) => el.getBoundingClientRect());

      const hGap = 10;
      const vGap = 6;
      const bulge = 14;

      const next = [];
      for (let i = 0; i < rects.length - 1; i++) {
        const anchorTop = i % 2 === 0;
        const a = rects[i];
        const b = rects[i + 1];
        const x1 = a.right - cRect.left + hGap;
        const x2 = b.left - cRect.left - hGap;
        const y1 = (anchorTop ? a.top - vGap : a.bottom + vGap) - cRect.top;
        const y2 = (anchorTop ? b.top - vGap : b.bottom + vGap) - cRect.top;
        const midX = (x1 + x2) / 2;
        const controlY = anchorTop
          ? Math.min(y1, y2) - bulge
          : Math.max(y1, y2) + bulge;
        next.push(`M${x1},${y1} Q${midX},${controlY} ${x2},${y2}`);
      }
      setPaths(next);
    };

    const trySetup = () => {
      if (cancelled) return;
      const container = containerRef.current;
      const icons = iconRefs.current.slice(0, count);
      if (!container || icons.some((el) => !el)) {
        rafId = requestAnimationFrame(trySetup);
        return;
      }
      measure(container);
      ro = new ResizeObserver(() => measure(container));
      ro.observe(container);
    };

    trySetup();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [containerRef, iconRefs, count]);

  return paths;
}

function ArrowsOverlay({ containerRef, iconRefs, count }) {
  const markerId = useId();
  const paths = useConnectorPaths(containerRef, iconRefs, count);

  if (!paths.length) return null;

  return (
    <svg
      className="hidden sm:block absolute inset-0 w-full h-full overflow-visible pointer-events-none text-violet/40"
      aria-hidden="true"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="7"
          markerHeight="7"
          refX="3.5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" />
        </marker>
      </defs>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
        />
      ))}
    </svg>
  );
}

export default function StepsRow({ steps }) {
  const containerRef = useRef(null);
  const iconRefs = useRef([]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 sm:gap-4 max-w-[1040px] mx-auto"
    >
      <ArrowsOverlay
        containerRef={containerRef}
        iconRefs={iconRefs}
        count={steps.length}
      />
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="flex flex-col items-center text-center w-full sm:w-auto sm:flex-1 sm:max-w-[220px] px-2"
        >
          <div
            ref={(el) => (iconRefs.current[i] = el)}
            className="relative z-10 w-16 h-16 rounded-2xl bg-violet/10 dark:bg-violet/15 flex items-center justify-center mb-4 shrink-0"
          >
            <s.icon size={26} className="text-violet" />
          </div>
          <h4 className="text-[1.02rem] font-extrabold text-violet dark:text-violet mb-1.5">
            {s.title}
          </h4>
          <p className="text-ink-soft dark:text-white/60 text-[.9rem] m-0 leading-snug">
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}
