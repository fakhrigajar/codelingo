import { useState } from 'react'
import { X } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { uid } from '../../lib/helpers'
import { uploadImage } from '../../lib/uploadImage'
import { useToast } from '../../context/ToastContext'
import {
  getLessonBlocks,
  labelLessonBlocks,
  SINGLE_BLOCK_TYPES,
  MULTI_BLOCK_TYPES,
  BLOCK_ADD_LABELS,
} from '../../lib/lessonBlocks'
import { AdminInput, AdminTextarea, AdminSelect, AdminButton, AdminImageUpload } from './AdminFields'
import SortableLessonBlock from './SortableLessonBlock'

const OPTION_PLACEHOLDERS = ['e.g. Option A', 'e.g. Option B', 'e.g. Option C', 'e.g. Option D']

function ImageBlockField({ block, onValueChange }) {
  const toast = useToast()
  const [uploading, setUploading] = useState(false)

  const handleChange = async (dataUrl) => {
    if (!dataUrl) {
      onValueChange('')
      return
    }
    setUploading(true)
    try {
      const url = await uploadImage(dataUrl)
      onValueChange(url)
    } catch (err) {
      toast(err.message || 'Could not upload image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminImageUpload
      label="Image"
      value={block.value}
      onChange={handleChange}
      disabled={uploading}
      buttonLabel={uploading ? 'Uploading…' : 'Upload image'}
      preview={block.value ? <img src={block.value} alt="" className="w-14 h-14 object-cover rounded-lg" /> : null}
    />
  )
}

function BlockField({ block, onValueChange }) {
  if (block.type === 'video') {
    return (
      <AdminInput
        label="Video URL"
        placeholder="A YouTube link or a direct video file (.mp4)"
        value={block.value || ''}
        onChange={(e) => onValueChange(e.target.value)}
      />
    )
  }
  if (block.type === 'image') {
    return <ImageBlockField block={block} onValueChange={onValueChange} />
  }
  if (block.type === 'body') {
    return (
      <AdminTextarea
        label="Lesson body"
        placeholder="Write the lesson content here…"
        value={block.value || ''}
        onChange={(e) => onValueChange(e.target.value)}
      />
    )
  }
  return (
    <AdminInput
      label="Fun fact"
      placeholder="An interesting fact related to this lesson"
      value={block.value || ''}
      onChange={(e) => onValueChange(e.target.value)}
    />
  )
}

export default function LessonEditor({ lesson, onChange, onRemove }) {
  const isQuiz = lesson.type === 'quiz'
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const blocks = getLessonBlocks(lesson)
  const labeledBlocks = labelLessonBlocks(blocks)
  const presentSingleTypes = new Set(blocks.filter((b) => SINGLE_BLOCK_TYPES.includes(b.type)).map((b) => b.type))
  const addableTypes = [...SINGLE_BLOCK_TYPES.filter((t) => !presentSingleTypes.has(t)), ...MULTI_BLOCK_TYPES]

  const setBlocks = (next) => onChange({ blocks: next })

  const handleBlockDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    setBlocks(arrayMove(blocks, oldIndex, newIndex))
  }
  const addBlock = (type) => {
    setBlocks([...blocks, { id: uid('block'), type, value: '' }])
  }
  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }
  const updateBlock = (id, value) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, value } : b)))
  }

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
          {labeledBlocks.length > 0 && (
            <>
              <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">
                Drag to reorder how these appear on the lesson page
              </span>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBlockDragEnd}>
                <SortableContext items={labeledBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {labeledBlocks.map((block) => (
                    <SortableLessonBlock
                      key={block.id}
                      id={block.id}
                      label={block.label}
                      onRemove={() => removeBlock(block.id)}
                    >
                      <BlockField block={block} onValueChange={(value) => updateBlock(block.id, value)} />
                    </SortableLessonBlock>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          )}
          {addableTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {addableTypes.map((type) => (
                <AdminButton key={type} variant="outline" onClick={() => addBlock(type)}>
                  {BLOCK_ADD_LABELS[type]}
                </AdminButton>
              ))}
            </div>
          )}
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
