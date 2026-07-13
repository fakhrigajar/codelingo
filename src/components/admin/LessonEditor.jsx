import { X } from 'lucide-react'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from './AdminFields'

const OPTION_PLACEHOLDERS = ['e.g. Option A', 'e.g. Option B', 'e.g. Option C', 'e.g. Option D']

export default function LessonEditor({ lesson, onChange, onRemove }) {
  const isQuiz = lesson.type === 'quiz'

  const updateQuestion = (qi, patch) => {
    onChange({ questions: lesson.questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)) })
  }
  const updateOption = (qi, oi, value) => {
    onChange({
      questions: lesson.questions.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      ),
    })
  }
  const addOption = (qi) => {
    onChange({ questions: lesson.questions.map((q, i) => (i === qi ? { ...q, options: [...q.options, 'New option'] } : q)) })
  }
  const removeOption = (qi, oi) => {
    onChange({
      questions: lesson.questions.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.filter((_, j) => j !== oi), correct: q.correct === oi ? 0 : q.correct }
          : q
      ),
    })
  }
  const addQuestion = () => {
    onChange({ questions: [...lesson.questions, { q: 'New question?', options: ['Option A', 'Option B'], correct: 0 }] })
  }
  const removeQuestion = (qi) => {
    onChange({ questions: lesson.questions.filter((_, i) => i !== qi) })
  }

  return (
    <div>
      <div className="grid sm:grid-cols-[1fr_140px] gap-3">
        <AdminInput
          label="Title"
          placeholder="e.g. Variables and Data Types"
          value={lesson.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <AdminSelect label="Type" value={lesson.type} onChange={(e) => onChange({ type: e.target.value })}>
          <option value="lesson">Lesson</option>
          <option value="quiz">Quiz</option>
        </AdminSelect>
      </div>

      {!isQuiz && (
        <>
          <AdminTextarea
            label="Lesson body"
            placeholder="Write the lesson content here…"
            value={lesson.body || ''}
            onChange={(e) => onChange({ body: e.target.value })}
          />
          <AdminInput
            label="Fun fact"
            placeholder="An interesting fact related to this lesson (optional)"
            value={lesson.fact || ''}
            onChange={(e) => onChange({ fact: e.target.value })}
          />
        </>
      )}

      {isQuiz && (
        <div className="space-y-3 mt-2">
          {(lesson.questions || []).map((q, qi) => (
            <div key={qi} className="border border-line dark:border-white/10 rounded-lg p-3 bg-white dark:bg-white/5">
              <div className="flex justify-between items-start gap-2">
                <span className="font-mono text-[.68rem] text-ink-soft dark:text-white/50 mt-2">Question {qi + 1}</span>
                <AdminButton variant="danger" onClick={() => removeQuestion(qi)}>
                  Remove
                </AdminButton>
              </div>
              <AdminInput
                label="Question text"
                placeholder="e.g. What does HTML stand for?"
                value={q.q}
                onChange={(e) => updateQuestion(qi, { q: e.target.value })}
              />
              <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">Options (select the correct one)</span>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${lesson.id}-${qi}`}
                    checked={q.correct === oi}
                    onChange={() => updateQuestion(qi, { correct: oi })}
                    title="Mark as correct answer"
                  />
                  <input
                    className="flex-1 px-3 py-2 border-2 border-line dark:border-white/15 dark:bg-white/5 dark:text-white rounded-lg text-[.88rem] focus:border-violet outline-none"
                    placeholder={OPTION_PLACEHOLDERS[oi] || `e.g. Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                  />
                  <AdminButton variant="ghost" onClick={() => removeOption(qi, oi)} disabled={q.options.length <= 2}>
                    <X size={14} />
                  </AdminButton>
                </div>
              ))}
              <AdminButton variant="outline" onClick={() => addOption(qi)}>
                + Add option
              </AdminButton>
            </div>
          ))}
          <AdminButton variant="outline" onClick={addQuestion}>
            + Add question
          </AdminButton>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-line dark:border-white/10">
        <AdminButton variant="danger" onClick={onRemove}>
          Remove this {isQuiz ? 'quiz' : 'lesson'}
        </AdminButton>
      </div>
    </div>
  )
}
