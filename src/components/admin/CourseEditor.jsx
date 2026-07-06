import { uid } from '../../lib/helpers'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from './AdminFields'
import LessonEditor from './LessonEditor'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function CourseEditor({ course, onChange, onRemove }) {
  const updateLesson = (lessonId, patch) => {
    onChange({ lessons: course.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) })
  }
  const removeLesson = (lessonId) => {
    onChange({ lessons: course.lessons.filter((l) => l.id !== lessonId) })
  }
  const addLesson = () => {
    onChange({
      lessons: [
        ...course.lessons,
        { id: uid('l'), type: 'lesson', title: 'New lesson', body: '', fact: '' },
      ],
    })
  }
  const addQuiz = () => {
    onChange({
      lessons: [
        ...course.lessons,
        { id: uid('q'), type: 'quiz', title: 'New quiz', questions: [{ q: 'New question?', options: ['Option A', 'Option B'], correct: 0 }] },
      ],
    })
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3">
        <AdminInput label="Title" value={course.title} onChange={(e) => onChange({ title: e.target.value })} />
        <AdminInput label="Icon (emoji)" value={course.icon} onChange={(e) => onChange({ icon: e.target.value })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <AdminSelect label="Level" value={course.level} onChange={(e) => onChange({ level: e.target.value })}>
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          label="Accent color"
          type="color"
          value={course.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="h-[42px] p-1"
        />
      </div>
      <AdminTextarea label="About" value={course.about} onChange={(e) => onChange({ about: e.target.value })} />

      <div className="mt-3">
        <span className="block font-bold text-[.85rem] mb-2 text-ink-soft">
          Lessons &amp; quizzes ({course.lessons.length})
        </span>
        <div className="space-y-3">
          {course.lessons.map((lesson) => (
            <LessonEditor
              key={lesson.id}
              lesson={lesson}
              onChange={(patch) => updateLesson(lesson.id, patch)}
              onRemove={() => removeLesson(lesson.id)}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <AdminButton variant="outline" onClick={addLesson}>
            + Add lesson
          </AdminButton>
          <AdminButton variant="outline" onClick={addQuiz}>
            + Add quiz
          </AdminButton>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line">
        <AdminButton variant="danger" onClick={onRemove}>
          Delete this course
        </AdminButton>
      </div>
    </div>
  )
}
