import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'
import { uid, courseById } from '../lib/helpers'
import AdminCard from '../components/admin/AdminCard'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from '../components/admin/AdminFields'
import SortableCourseRow from '../components/admin/SortableCourseRow'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function PathCourseEditor({ path, courses, updatePath }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const linkedCourses = path.courseIds.map((id) => courseById(courses, id)).filter(Boolean)
  const availableCourses = courses.filter((c) => !path.courseIds.includes(c.id))

  const addCourse = (courseId) => {
    if (!courseId) return
    updatePath(path.id, { courseIds: [...path.courseIds, courseId] })
  }

  const removeCourse = (courseId) => {
    updatePath(path.id, { courseIds: path.courseIds.filter((id) => id !== courseId) })
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = path.courseIds.indexOf(active.id)
    const newIndex = path.courseIds.indexOf(over.id)
    updatePath(path.id, { courseIds: arrayMove(path.courseIds, oldIndex, newIndex) })
  }

  return (
    <div className="mt-2">
      <AdminSelect key={path.courseIds.length} label="Add course" onChange={(e) => addCourse(e.target.value)}>
        <option value="">— pick a course to add —</option>
        {availableCourses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </AdminSelect>

      {linkedCourses.length === 0 ? (
        <p className="text-ink-soft dark:text-white/60 text-[.85rem]">No courses in this path yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={path.courseIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {linkedCourses.map((course, i) => (
                <SortableCourseRow key={course.id} course={course} index={i} onRemove={removeCourse} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

export default function AdminPathsPage() {
  const { paths, addPath, updatePath, removePath, courses, pageText, setPageText } = useContent()
  const toast = useToast()
  const [openPathId, setOpenPathId] = useState(null)
  const [pageTextDraft, setPageTextDraft] = useState(pageText)
  const [drafts, setDrafts] = useState({})

  const handleAddPath = () => {
    const newPath = { id: uid('path'), label: `New Path`, level: 'Beginner', courseIds: [] }
    addPath(newPath)
    setOpenPathId(newPath.id)
    toast('Path added')
  }

  const handleRemovePath = (id) => {
    if (!confirm('Delete this path? This cannot be undone.')) return
    removePath(id)
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (openPathId === id) setOpenPathId(null)
    toast('Path deleted')
  }

  const toggleOpen = (id) => {
    if (openPathId === id) {
      setOpenPathId(null)
      return
    }
    setDrafts((prev) => (prev[id] ? prev : { ...prev, [id]: { label: paths.find((p) => p.id === id).label, level: paths.find((p) => p.id === id).level } }))
    setOpenPathId(id)
  }

  const patchDraft = (id, patch) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const handleSubmit = () => {
    let changed = 0
    if (pageTextDraft.pathsTitle !== pageText.pathsTitle || pageTextDraft.pathsSubtitle !== pageText.pathsSubtitle) {
      setPageText(pageTextDraft)
      changed++
    }
    Object.entries(drafts).forEach(([id, draft]) => {
      updatePath(id, draft)
      changed++
    })
    setDrafts({})
    setOpenPathId(null)
    toast(changed ? 'Changes saved' : 'Nothing to save')
  }

  return (
    <div>
      <h1 className="text-2xl mb-1">Paths</h1>
      <p className="text-ink-soft dark:text-white/60 mb-6">
        Edit the header shown at the top of the Paths page, then build each path's ordered list of courses. Edits are
        staged until you save.
      </p>

      <AdminCard title="Section header" className="mb-6">
        <AdminInput
          label="Page title"
          placeholder="e.g. Learning paths"
          value={pageTextDraft.pathsTitle}
          onChange={(e) => setPageTextDraft((prev) => ({ ...prev, pathsTitle: e.target.value }))}
        />
        <AdminTextarea
          label="Page subtitle"
          placeholder="A short description shown under the page title"
          value={pageTextDraft.pathsSubtitle}
          onChange={(e) => setPageTextDraft((prev) => ({ ...prev, pathsSubtitle: e.target.value }))}
        />
      </AdminCard>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg m-0">Paths</h2>
        <AdminButton onClick={handleAddPath}>+ Add path</AdminButton>
      </div>

      <div className="space-y-4">
        {paths.map((path) => {
          const open = openPathId === path.id
          const draft = drafts[path.id] ?? path
          return (
            <AdminCard key={path.id}>
              <div className="flex justify-between items-center gap-3 flex-wrap">
                <div>
                  <span className="font-extrabold">{path.label || 'Untitled path'}</span>
                  <span className="text-ink-soft dark:text-white/50 text-sm ml-2">
                    · {path.level} · {path.courseIds.length} courses
                  </span>
                </div>
                <AdminButton variant="outline" onClick={() => toggleOpen(path.id)}>
                  {open ? (
                    <span className="inline-flex items-center gap-1">
                      Close <ChevronUp size={14} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      Edit <ChevronDown size={14} />
                    </span>
                  )}
                </AdminButton>
              </div>

              {open && (
                <div className="mt-4 pt-4 border-t border-line dark:border-white/10">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <AdminInput
                      label="Path label"
                      placeholder="e.g. Frontend Developer"
                      value={draft.label}
                      onChange={(e) => patchDraft(path.id, { label: e.target.value })}
                    />
                    <AdminSelect
                      label="Level"
                      value={draft.level}
                      onChange={(e) => patchDraft(path.id, { level: e.target.value })}
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </AdminSelect>
                  </div>

                  <PathCourseEditor path={path} courses={courses} updatePath={updatePath} />

                  <div className="flex justify-end mt-3">
                    <AdminButton variant="danger" onClick={() => handleRemovePath(path.id)}>
                      Delete this path
                    </AdminButton>
                  </div>
                </div>
              )}
            </AdminCard>
          )
        })}
      </div>

      <div className="flex justify-end mt-6">
        <AdminButton onClick={handleSubmit}>Save changes</AdminButton>
      </div>
    </div>
  )
}
