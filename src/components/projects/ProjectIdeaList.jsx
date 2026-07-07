import ProjectWireframe from './ProjectWireframe'

export default function ProjectIdeaList({ ideas }) {
  return (
    <div className="grid sm:grid-cols-2 desktop:grid-cols-3 gap-5 mt-7">
      {ideas.map((idea, i) => (
        <div
          key={i}
          className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-5 flex flex-col"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[1.05rem]">{idea.title}</h3>
            {idea.estimatedTime && (
              <span className="shrink-0 font-mono text-[.7rem] font-bold text-ink-soft dark:text-white/50 bg-bg dark:bg-white/10 px-2 py-1 rounded-md">
                {idea.estimatedTime}
              </span>
            )}
          </div>
          <ProjectWireframe wireframe={idea.wireframe} />
          <p className="text-[.88rem] text-ink-soft dark:text-white/70 flex-1">{idea.description}</p>
          {idea.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {idea.skills.map((s, si) => (
                <span
                  key={si}
                  className="px-2.5 py-1 rounded-md font-mono text-[.7rem] font-bold bg-violet/10 text-violet"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
