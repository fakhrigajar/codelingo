import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { uid } from "../../lib/helpers";
import { uploadImage } from "../../lib/uploadImage";
import { resolveUploadUrl } from "../../lib/resolveUploadUrl";
import { useToast } from "../../context/ToastContext";
import {
  getLessonBlocks,
  labelLessonBlocks,
  SINGLE_BLOCK_TYPES,
  MULTI_BLOCK_TYPES,
  BLOCK_ADD_LABELS,
} from "../../lib/lessonBlocks";
import {
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminImageUpload,
} from "./AdminFields";
import SortableLessonBlock from "./SortableLessonBlock";

const OPTION_PLACEHOLDERS = [
  "e.g. Option A",
  "e.g. Option B",
  "e.g. Option C",
  "e.g. Option D",
];

function ImageBlockField({ block, onValueChange }) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const handleChange = async (dataUrl) => {
    if (!dataUrl) {
      onValueChange("");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(dataUrl);
      onValueChange(url);
    } catch (err) {
      toast(err.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminImageUpload
      label="Image"
      value={block.value}
      onChange={handleChange}
      disabled={uploading}
      buttonLabel={uploading ? "Uploading…" : "Upload image"}
      preview={
        block.value ? (
          <img
            src={resolveUploadUrl(block.value)}
            alt=""
            className="w-14 h-14 object-cover rounded-lg"
          />
        ) : null
      }
    />
  );
}

function BlockField({ block, onValueChange, onTitleChange }) {
  if (block.type === "video") {
    return (
      <AdminInput
        label="Video URL"
        placeholder="A YouTube link or a direct video file (.mp4)"
        value={block.value || ""}
        onChange={(e) => onValueChange(e.target.value)}
      />
    );
  }
  if (block.type === "image") {
    return <ImageBlockField block={block} onValueChange={onValueChange} />;
  }
  if (block.type === "link") {
    return (
      <>
        <AdminInput
          label="Link URL"
          type="url"
          placeholder="https://example.com"
          value={block.value || ""}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <AdminInput
          label="Link label (optional)"
          placeholder="e.g. MDN CSS docs"
          value={block.title || ""}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </>
    );
  }
  if (block.type === "body") {
    return (
      <AdminTextarea
        label="Lesson body"
        placeholder="Write the lesson content here…"
        value={block.value || ""}
        onChange={(e) => onValueChange(e.target.value)}
      />
    );
  }
  return (
    <AdminInput
      label="Fun fact"
      placeholder="An interesting fact related to this lesson"
      value={block.value || ""}
      onChange={(e) => onValueChange(e.target.value)}
    />
  );
}

export default function LessonEditor({ lesson, onChange, onRemove }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const blocks = getLessonBlocks(lesson);
  const labeledBlocks = labelLessonBlocks(blocks);
  const presentSingleTypes = new Set(
    blocks
      .filter((b) => SINGLE_BLOCK_TYPES.includes(b.type))
      .map((b) => b.type),
  );
  const addableTypes = [
    ...SINGLE_BLOCK_TYPES.filter((t) => !presentSingleTypes.has(t)),
    ...MULTI_BLOCK_TYPES,
  ];

  const setBlocks = (next) => onChange({ blocks: next });

  const handleBlockDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    setBlocks(arrayMove(blocks, oldIndex, newIndex));
  };
  const addBlock = (type) => {
    setBlocks([...blocks, { id: uid("block"), type, value: "" }]);
  };
  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };
  const patchBlock = (id, patch) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  // The practice quiz shown after this lesson's content, on the lesson page —
  // every question always has exactly 4 options with one marked correct,
  // matching the shape the rest of the app already assumes everywhere else
  // (LessonPracticeQuiz, the AI generation script).
  const practiceQuiz = lesson.practiceQuiz || [];
  const updatePracticeQuestion = (qi, patch) => {
    onChange({
      practiceQuiz: practiceQuiz.map((q, i) =>
        i === qi ? { ...q, ...patch } : q,
      ),
    });
  };
  const updatePracticeOption = (qi, oi, value) => {
    onChange({
      practiceQuiz: practiceQuiz.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) }
          : q,
      ),
    });
  };
  const addPracticeQuestion = () => {
    onChange({
      practiceQuiz: [
        ...practiceQuiz,
        { q: "", options: ["", "", "", ""], correct: 0 },
      ],
    });
  };
  const removePracticeQuestion = (qi) => {
    onChange({ practiceQuiz: practiceQuiz.filter((_, i) => i !== qi) });
  };

  return (
    <div>
      <div className="grid sm:grid-cols-[1fr_140px_140px] gap-3">
        <AdminInput
          label="Title"
          placeholder="e.g. Variables and Data Types"
          value={lesson.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <AdminInput
          label="Est. minutes"
          type="number"
          min="0"
          placeholder="e.g. 15"
          value={lesson.estimatedMinutes ?? ""}
          onChange={(e) =>
            onChange({
              estimatedMinutes:
                e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        />
        <AdminInput
          label="Points (XP)"
          type="number"
          min="0"
          placeholder="e.g. 10"
          value={lesson.points ?? ""}
          onChange={(e) =>
            onChange({
              points:
                e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        />
      </div>

      {labeledBlocks.length > 0 && (
        <>
          <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">
            Drag to reorder how these appear on the lesson page
          </span>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBlockDragEnd}
          >
            <SortableContext
              items={labeledBlocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {labeledBlocks.map((block) => (
                <SortableLessonBlock
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  onRemove={() => removeBlock(block.id)}
                >
                  <BlockField
                    block={block}
                    onValueChange={(value) => patchBlock(block.id, { value })}
                    onTitleChange={(title) => patchBlock(block.id, { title })}
                  />
                </SortableLessonBlock>
              ))}
            </SortableContext>
          </DndContext>
        </>
      )}
      {addableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {addableTypes.map((type) => (
            <AdminButton
              key={type}
              variant="outline"
              onClick={() => addBlock(type)}
            >
              {BLOCK_ADD_LABELS[type]}
            </AdminButton>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-line dark:border-white/10">
        <span className="block font-bold text-[.9rem] mb-1">
          Practice quiz
        </span>
        <p className="text-[.78rem] text-ink-soft dark:text-white/50 mb-3">
          Shown after this lesson's content as a self-check. Each question
          needs exactly 4 options, with one marked correct.
        </p>
        <div className="space-y-3">
          {practiceQuiz.map((q, qi) => (
            <div
              key={qi}
              className="border border-line dark:border-white/10 rounded-lg p-3 bg-white dark:bg-white/5"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="font-mono text-[.68rem] text-ink-soft dark:text-white/50 mt-2">
                  Question {qi + 1}
                </span>
                <AdminButton
                  variant="danger"
                  onClick={() => removePracticeQuestion(qi)}
                >
                  Remove
                </AdminButton>
              </div>
              <AdminInput
                label="Question text"
                placeholder="e.g. HTML stands for ______."
                value={q.q}
                onChange={(e) => updatePracticeQuestion(qi, { q: e.target.value })}
              />
              <span className="block font-bold text-[.8rem] mb-1 text-ink-soft dark:text-white/60">
                Options (select the correct one)
              </span>
              {[0, 1, 2, 3].map((oi) => (
                <div key={oi} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`practice-correct-${lesson.id}-${qi}`}
                    checked={q.correct === oi}
                    onChange={() => updatePracticeQuestion(qi, { correct: oi })}
                    title="Mark as correct answer"
                  />
                  <input
                    className="flex-1 px-3 py-2 border-2 border-line dark:border-white/15 dark:bg-white/5 dark:text-white rounded-lg text-[.88rem] focus:border-violet outline-none"
                    placeholder={OPTION_PLACEHOLDERS[oi]}
                    value={q.options?.[oi] || ""}
                    onChange={(e) => updatePracticeOption(qi, oi, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
          <AdminButton variant="outline" onClick={addPracticeQuestion}>
            + Add question
          </AdminButton>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-line dark:border-white/10">
        <AdminButton variant="danger" className="w-full" onClick={onRemove}>
          Remove this lesson
        </AdminButton>
      </div>
    </div>
  );
}
