import { useId } from 'react'

// A clear, unmistakable downward connector between learning path steps.
// Each instance needs its own marker id — SVG <marker> ids are global to
// the document, so reusing one id across multiple arrows would make every
// arrow reference whichever <defs> happened to render first.
export default function PathArrow() {
  const markerId = useId()

  return (
    <svg
      width="36"
      height="52"
      viewBox="0 0 36 52"
      className="text-violet"
      aria-hidden="true"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
        </marker>
      </defs>
      <line
        x1="18"
        y1="2"
        x2="18"
        y2="42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  )
}
