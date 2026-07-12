import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid } from '../lib/helpers'
import AdminCard from '../components/admin/AdminCard'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from '../components/admin/AdminFields'

function emptyTopic() {
  return { title: 'New topic', desc: '', source: { courseId: '', lessonId: '' } }
}

export default function AdminGradesPage() {
  const { grades, addGrade, updateGrade, removeGrade, courses, pageText, setPageText } = useContent()
  const toast = useToast()
  const [openGradeId, setOpenGradeId] = useState(grades[0]?.id || null)

  const gradeTopics = (gradeId) => grades.find((g) => g.id === gradeId)?.topics || []

  const updateTopic = (gradeId, index, patch) => {
    const topics = gradeTopics(gradeId).map((t, i) => (i === index ? { ...t, ...patch } : t))
    updateGrade(gradeId, { topics })
  }

  const updateTopicSource = (gradeId, index, sourcePatch) => {
    const topics = gradeTopics(gradeId).map((t, i) =>
      i === index ? { ...t, source: { ...t.source, ...sourcePatch } } : t,
    )
    updateGrade(gradeId, { topics })
  }

  const addTopic = (gradeId) => {
    updateGrade(gradeId, { topics: [...gradeTopics(gradeId), emptyTopic()] })
  }

  const removeTopic = (gradeId, index) => {
    updateGrade(gradeId, { topics: gradeTopics(gradeId).filter((_, i) => i !== index) })
  }

  const handleAddGrade = () => {
    const newGrade = { id: uid('grade'), label: `Grade ${grades.length + 1}`, age: '', topics: [] }
    addGrade(newGrade)
    setOpenGradeId(newGrade.id)
    toast('Grade added')
  }

  const handleRemoveGrade = (id) => {
    if (!confirm('Delete this grade and its whole roadmap? This cannot be undone.')) return
    removeGrade(id)
    toast('Grade deleted')
  }

  return (
    <div>
      <h1 className="text-2xl mb-1">Grades</h1>
      <p className="text-ink-soft mb-6">
        Edit the header shown at the top of the Grades page, then manage each grade's roadmap stops.
      </p>

      <AdminCard title="Section header" className="mb-6">
        <AdminInput
          label="Page title"
          value={pageText.gradesTitle}
          onChange={(e) => setPageText({ gradesTitle: e.target.value })}
        />
        <AdminTextarea
          label="Page subtitle"
          value={pageText.gradesSubtitle}
          onChange={(e) => setPageText({ gradesSubtitle: e.target.value })}
        />
      </AdminCard>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg m-0">Grade roadmaps</h2>
        <AdminButton onClick={handleAddGrade}>+ Add grade</AdminButton>
      </div>

      <div className="space-y-4">
        {grades.map((grade) => {
          const open = openGradeId === grade.id
          return (
            <AdminCard key={grade.id}>
              <div
                className="flex justify-between items-center gap-3 flex-wrap cursor-pointer"
                onClick={() => setOpenGradeId(open ? null : grade.id)}
              >
                <div>
                  <span className="font-extrabold">{grade.label || 'Untitled grade'}</span>
                  <span className="text-ink-soft text-sm ml-2">
                    · {grade.age || '—'} · {grade.topics.length} topics
                  </span>
                </div>
                <span className="text-ink-soft">{open ? '▲' : '▼'}</span>
              </div>

              {open && (
                <div className="mt-4 pt-4 border-t border-line">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <AdminInput
                      label="Grade label"
                      value={grade.label}
                      onChange={(e) => updateGrade(grade.id, { label: e.target.value })}
                    />
                    <AdminInput
                      label="Stage"
                      value={grade.age}
                      onChange={(e) => updateGrade(grade.id, { age: e.target.value })}
                      placeholder="e.g. New to code"
                    />
                  </div>

                  <div className="mt-2 space-y-3">
                    {grade.topics.map((topic, i) => {
                      const course = courses.find((c) => c.id === topic.source?.courseId)
                      return (
                        <div key={i} className="border-2 border-line rounded-xl p-3.5 bg-bg">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-mono text-xs text-ink-soft mt-2">Stop {i + 1}</span>
                            <AdminButton variant="danger" onClick={() => removeTopic(grade.id, i)}>
                              Remove
                            </AdminButton>
                          </div>
                          <AdminInput
                            label="Topic title"
                            value={topic.title}
                            onChange={(e) => updateTopic(grade.id, i, { title: e.target.value })}
                          />
                          <AdminTextarea
                            label="Topic description"
                            value={topic.desc}
                            onChange={(e) => updateTopic(grade.id, i, { desc: e.target.value })}
                          />
                          <div className="grid sm:grid-cols-2 gap-3">
                            <AdminSelect
                              label="Linked course"
                              value={topic.source?.courseId || ''}
                              onChange={(e) =>
                                updateTopicSource(grade.id, i, { courseId: e.target.value, lessonId: '' })
                              }
                            >
                              <option value="">— none —</option>
                              {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.icon} {c.title}
                                </option>
                              ))}
                            </AdminSelect>
                            <AdminSelect
                              label="Linked lesson"
                              value={topic.source?.lessonId || ''}
                              onChange={(e) => updateTopicSource(grade.id, i, { lessonId: e.target.value })}
                              disabled={!course}
                            >
                              <option value="">— none —</option>
                              {course?.lessons.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.title}
                                </option>
                              ))}
                            </AdminSelect>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <AdminButton variant="outline" onClick={() => addTopic(grade.id)}>
                      + Add topic
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => handleRemoveGrade(grade.id)}>
                      Delete this grade
                    </AdminButton>
                  </div>
                </div>
              )}
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
