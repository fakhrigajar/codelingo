// Renders a low-fidelity, annotated mockup of a project's main screen so a
// beginner can visualize what to actually build, not just read a paragraph.
const BLOCK_HEIGHT = {
  header: 'h-4',
  nav: 'h-2.5',
  hero: 'h-12',
  sidebar: 'h-9',
  form: 'h-8',
  list: 'h-8',
  grid: 'h-10',
  chart: 'h-10',
  footer: 'h-3',
}

function BlockShape({ block }) {
  if (block === 'grid' || block === 'chart') {
    return (
      <div className={`${BLOCK_HEIGHT[block]} flex gap-1`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 bg-violet/25 dark:bg-violet/30 rounded-md" />
        ))}
      </div>
    )
  }

  if (block === 'list') {
    return (
      <div className={`${BLOCK_HEIGHT[block]} flex flex-col gap-1 justify-center`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 bg-violet/25 dark:bg-violet/30 rounded-full"
            style={{ width: `${90 - i * 15}%` }}
          />
        ))}
      </div>
    )
  }

  return <div className={`${BLOCK_HEIGHT[block] || 'h-6'} bg-violet/25 dark:bg-violet/30 rounded-md`} />
}

export default function ProjectWireframe({ wireframe }) {
  if (!wireframe || wireframe.length === 0) return null

  return (
    <div className="bg-bg dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-xl p-3 mb-3.5">
      <div className="flex gap-1 mb-2.5 px-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-line dark:bg-white/15" />
        <span className="w-1.5 h-1.5 rounded-full bg-line dark:bg-white/15" />
        <span className="w-1.5 h-1.5 rounded-full bg-line dark:bg-white/15" />
      </div>
      <div className="space-y-2">
        {wireframe.map((b, i) => (
          <div key={i}>
            <BlockShape block={b.block} />
            <p className="text-[.66rem] leading-snug mt-1 text-ink-soft dark:text-white/50">
              <span className="font-mono uppercase font-bold text-violet">{b.block}</span>
              {b.label ? ` — ${b.label}` : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
