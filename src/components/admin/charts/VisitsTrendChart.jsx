import { useRef, useState } from "react";
import { CHART_SEQUENTIAL } from "../../../lib/chartColors";

const VB_WIDTH = 600;
const VB_HEIGHT = 220;
const PADDING = { top: 22, right: 8, bottom: 26, left: 30 };
const PLOT_WIDTH = VB_WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = VB_HEIGHT - PADDING.top - PADDING.bottom;

function niceMax(value) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const residual = value / magnitude;
  const niceResidual = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

// A single-series trend line (visits per day): one hue, so no legend box —
// the card title already names what's plotted. Direct-labels only the most
// recent point (the one the story is about); every other value lives in the
// hover tooltip, which tracks the pointer and snaps to the nearest day.
export default function VisitsTrendChart({ data }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data.length || data.every((d) => d.count === 0)) {
    return <p className="text-ink-soft dark:text-white/60 text-[.85rem] m-0">No visits recorded yet.</p>;
  }

  const yMax = niceMax(Math.max(...data.map((d) => d.count)));
  const points = data.map((d, i) => ({
    ...d,
    x: PADDING.left + (data.length === 1 ? 0 : (i / (data.length - 1)) * PLOT_WIDTH),
    y: PADDING.top + PLOT_HEIGHT - (d.count / yMax) * PLOT_HEIGHT,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const baselineY = PADDING.top + PLOT_HEIGHT;
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;

  const labelCount = Math.min(5, points.length);
  const labelIndices = new Set(
    Array.from({ length: labelCount }, (_, i) =>
      Math.round((i * (points.length - 1)) / Math.max(labelCount - 1, 1)),
    ),
  );

  const last = points[points.length - 1];
  const hovered = hoverIndex === null ? null : points[hoverIndex];

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const vbX = relX * VB_WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - vbX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full h-auto block"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {[0, 0.5, 1].map((f) => {
          const y = PADDING.top + PLOT_HEIGHT * (1 - f);
          const value = Math.round(yMax * f);
          return (
            <g key={f}>
              <line
                x1={PADDING.left}
                x2={VB_WIDTH - PADDING.right}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                className="text-line dark:text-white/10"
              />
              <text
                x={PADDING.left - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-ink-soft dark:fill-white/40"
                fontSize={9}
                fontFamily="inherit"
              >
                {value}
              </text>
            </g>
          );
        })}

        {points.map(
          (p, i) =>
            labelIndices.has(i) && (
              <text
                key={p.key}
                x={p.x}
                y={VB_HEIGHT - 6}
                textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                className="fill-ink-soft dark:fill-white/40"
                fontSize={9}
                fontFamily="inherit"
              >
                {p.label}
              </text>
            ),
        )}

        <path
          d={areaPath}
          className="[fill:var(--trend-light)] dark:[fill:var(--trend-dark)]"
          style={{ "--trend-light": CHART_SEQUENTIAL.light, "--trend-dark": CHART_SEQUENTIAL.dark, opacity: 0.1 }}
        />
        <path
          d={linePath}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke:var(--trend-light)] dark:[stroke:var(--trend-dark)]"
          style={{ "--trend-light": CHART_SEQUENTIAL.light, "--trend-dark": CHART_SEQUENTIAL.dark }}
        />

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PADDING.top}
            y2={baselineY}
            stroke="currentColor"
            strokeWidth={1}
            className="text-line dark:text-white/15"
          />
        )}

        <circle
          cx={last.x}
          cy={last.y}
          r={6}
          className="stroke-white dark:stroke-indigo-dark [fill:var(--trend-light)] dark:[fill:var(--trend-dark)]"
          strokeWidth={2}
          style={{ "--trend-light": CHART_SEQUENTIAL.light, "--trend-dark": CHART_SEQUENTIAL.dark }}
        />
        {hovered && hoverIndex !== points.length - 1 && (
          <circle
            cx={hovered.x}
            cy={hovered.y}
            r={5}
            className="stroke-white dark:stroke-indigo-dark [fill:var(--trend-light)] dark:[fill:var(--trend-dark)]"
            strokeWidth={2}
            style={{ "--trend-light": CHART_SEQUENTIAL.light, "--trend-dark": CHART_SEQUENTIAL.dark }}
          />
        )}

        <text
          x={last.x}
          y={last.y - 12}
          textAnchor="end"
          className="fill-ink dark:fill-white font-bold"
          fontSize={11}
          fontFamily="inherit"
        >
          {last.count}
        </text>
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full bg-indigo-dark dark:bg-white text-white dark:text-indigo-dark rounded-lg px-2.5 py-1.5 text-[.75rem] font-bold whitespace-nowrap shadow-lg"
          style={{
            left: `${(hovered.x / VB_WIDTH) * 100}%`,
            top: `${(hovered.y / VB_HEIGHT) * 100}%`,
            marginTop: -10,
          }}
        >
          {hovered.count} visit{hovered.count === 1 ? "" : "s"}
          <span className="block font-normal opacity-70 text-[.68rem]">{hovered.label}</span>
        </div>
      )}
    </div>
  );
}
