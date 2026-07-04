import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoadmapNode({ index, topic, course, lesson, done }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!course || !lesson) {
    return (
      <div className="relative mb-5">
        <div className="absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full bg-white border-[3px] border-line flex items-center justify-center font-mono font-bold text-[.85rem] text-ink-soft z-10">
          {index + 1}
        </div>
        <div className="bg-white border-2 border-line rounded-2xl px-5 py-[18px]">
          <h4 className="m-0 text-[1.05rem]">{topic.title}</h4>
          <p className="mt-2 mb-0 text-ink-soft text-[.9rem]">{topic.desc}</p>
          <p className="mt-2 mb-0 text-coral text-[.8rem] font-bold">Linked lesson not found — check this topic in Admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mb-5">
      <div
        className={`absolute -left-[55px] top-0 w-[34px] h-[34px] rounded-full border-[3px] flex items-center justify-center font-mono font-bold text-[.85rem] z-10 ${
          done ? 'bg-mint border-mint text-white' : 'bg-white border-line text-ink-soft'
        }`}
      >
        {done ? '✓' : index + 1}
      </div>
      <div
        onClick={() => setOpen((o) => !o)}
        className={`bg-white border-2 rounded-2xl px-5 py-[18px] cursor-pointer transition-colors hover:border-violet ${
          open ? 'border-violet' : 'border-line'
        }`}
      >
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <h4 className="m-0 text-[1.05rem]">{topic.title}</h4>
          <span className="font-mono text-xs text-ink-soft whitespace-nowrap">
            {course.icon} {course.title}
          </span>
        </div>
        <p className="mt-2 mb-0 text-ink-soft text-[.9rem]">{topic.desc}</p>
      </div>
      {open && (
        <div className="mt-2.5 bg-bg border-2 border-line rounded-xl px-[18px] py-4">
          <div className="font-mono text-xs text-violet font-bold tracking-wide mb-2">SOURCE</div>
          <p className="mb-3.5">
            {course.icon} <strong>{course.title}</strong> → {lesson.title}{' '}
            <span className="font-mono text-[.72rem] text-ink-soft">({lesson.type === 'quiz' ? 'quiz' : 'lesson'})</span>
          </p>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => navigate(`/courses/${course.id}?lesson=${lesson.id}`)}
          >
            Open this lesson →
          </button>
        </div>
      )}
    </div>
  )
}
