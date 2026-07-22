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
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useToast } from "../context/ToastContext";
import { useAdminSaveBar } from "../context/AdminSaveBarContext";
import { uid, courseById } from "../lib/helpers";
import AdminCard from "../components/admin/AdminCard";
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminButton,
} from "../components/admin/AdminFields";
import SortableCourseRow from "../components/admin/SortableCourseRow";
import FadeIn from "../components/common/FadeIn";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function PathCourseEditor({ path, courses, updatePath }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const linkedCourses = path.courseIds
    .map((id) => courseById(courses, id))
    .filter(Boolean);
  const availableCourses = courses.filter(
    (c) => !path.courseIds.includes(c.id),
  );

  const addCourse = (courseId) => {
    if (!courseId) return;
    updatePath(path.id, { courseIds: [...path.courseIds, courseId] });
  };

  const removeCourse = (courseId) => {
    updatePath(path.id, {
      courseIds: path.courseIds.filter((id) => id !== courseId),
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = path.courseIds.indexOf(active.id);
    const newIndex = path.courseIds.indexOf(over.id);
    updatePath(path.id, {
      courseIds: arrayMove(path.courseIds, oldIndex, newIndex),
    });
  };

  return (
    <div className="mt-2">
      <AdminSelect
        key={path.courseIds.length}
        label="Add course"
        onChange={(e) => addCourse(e.target.value)}
      >
        <option value="">— pick a course to add —</option>
        {availableCourses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </AdminSelect>

      {linkedCourses.length === 0 ? (
        <p className="text-ink-soft dark:text-white/60 text-[.85rem]">
          No courses in this path yet.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={path.courseIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {linkedCourses.map((course, i) => (
                <SortableCourseRow
                  key={course.id}
                  course={course}
                  index={i}
                  onRemove={removeCourse}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export default function AdminPathsPage() {
  const {
    paths,
    addPath,
    updatePath,
    removePath,
    courses,
    pageText,
    setPageText,
  } = useContent();
  const toast = useToast();
  const [openPathId, setOpenPathId] = useState(null);
  const [pageTextDraft, setPageTextDraft] = useState(pageText);
  const [drafts, setDrafts] = useState({});

  const handleAddPath = () => {
    const newPath = {
      id: uid("path"),
      label: `New Path`,
      level: "Beginner",
      courseIds: [],
    };
    addPath(newPath);
    setOpenPathId(newPath.id);
    toast("Path added");
  };

  const handleRemovePath = (id) => {
    if (!confirm("Delete this path? This cannot be undone.")) return;
    removePath(id);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (openPathId === id) setOpenPathId(null);
    toast("Path deleted");
  };

  const toggleOpen = (id) => {
    if (openPathId === id) {
      setOpenPathId(null);
      return;
    }
    setDrafts((prev) =>
      prev[id]
        ? prev
        : {
            ...prev,
            [id]: {
              label: paths.find((p) => p.id === id).label,
              level: paths.find((p) => p.id === id).level,
            },
          },
    );
    setOpenPathId(id);
  };

  const patchDraft = (id, patch) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const pageTextDirty =
    pageTextDraft.pathsTitle !== pageText.pathsTitle ||
    pageTextDraft.pathsSubtitle !== pageText.pathsSubtitle;
  const changedDraftIds = Object.keys(drafts).filter((id) => {
    const path = paths.find((p) => p.id === id);
    return (
      path &&
      (drafts[id].label !== path.label || drafts[id].level !== path.level)
    );
  });
  const dirty = pageTextDirty || changedDraftIds.length > 0;

  const handleSubmit = () => {
    let changed = 0;
    if (pageTextDirty) {
      setPageText(pageTextDraft);
      changed++;
    }
    changedDraftIds.forEach((id) => {
      updatePath(id, drafts[id]);
      changed++;
    });
    setDrafts({});
    setOpenPathId(null);
    toast(changed ? "Changes saved" : "Nothing to save");
  };

  const handleDiscard = () => {
    setPageTextDraft(pageText);
    setDrafts({});
    setOpenPathId(null);
  };

  useAdminSaveBar({
    dirty,
    message: "You have unsaved path changes",
    onSave: handleSubmit,
    onDiscard: handleDiscard,
  });

  return (
    <div>
      <FadeIn delay={0.05}>
        <h1 className="text-2xl mb-1">Paths</h1>
        <p className="text-ink-soft dark:text-white/60 mb-6">
          Edit the header shown at the top of the Paths page, then build each
          path's ordered list of courses. Edits are staged until you save.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <AdminCard title="Section header" className="mb-6">
          <AdminInput
            label="Page title"
            placeholder="e.g. Learning paths"
            value={pageTextDraft.pathsTitle}
            onChange={(e) =>
              setPageTextDraft((prev) => ({
                ...prev,
                pathsTitle: e.target.value,
              }))
            }
          />
          <AdminTextarea
            label="Page subtitle"
            placeholder="A short description shown under the page title"
            value={pageTextDraft.pathsSubtitle}
            onChange={(e) =>
              setPageTextDraft((prev) => ({
                ...prev,
                pathsSubtitle: e.target.value,
              }))
            }
          />
        </AdminCard>
      </FadeIn>

      <FadeIn delay={0.25} className="flex justify-between items-center mb-3">
        <h2 className="text-lg m-0">Paths</h2>
        <AdminButton onClick={handleAddPath}>+ Add path</AdminButton>
      </FadeIn>

      <FadeIn delay={0.35} className="space-y-4">
        {paths.map((path, i) => {
          const open = openPathId === path.id;
          const draft = drafts[path.id] ?? path;
          return (
            <FadeIn key={path.id} delay={Math.min(0.35 + i * 0.05, 0.4)}>
              <AdminCard>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold truncate">
                      {path.label || "Untitled path"}
                    </div>
                    <div className="text-ink-soft dark:text-white/50 text-sm mt-0.5">
                      {path.level} · {path.courseIds.length} course
                      {path.courseIds.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                    <AdminButton
                      variant="primary"
                      onClick={() => toggleOpen(path.id)}
                    >
                      {open ? (
                        <span className="inline-flex items-center justify-center gap-1">
                          Close <ChevronUp size={14} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1">
                          Edit <ChevronDown size={14} />
                        </span>
                      )}
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      onClick={() => handleRemovePath(path.id)}
                      aria-label="Delete path"
                    >
                      <Trash2 size={14} className="mx-auto" />
                    </AdminButton>
                  </div>
                </div>

                {open && (
                  <div className="mt-4 pt-4 border-t border-line dark:border-white/10">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <AdminInput
                        label="Path label"
                        placeholder="e.g. Frontend Developer"
                        value={draft.label}
                        onChange={(e) =>
                          patchDraft(path.id, { label: e.target.value })
                        }
                      />
                      <AdminSelect
                        label="Level"
                        value={draft.level}
                        onChange={(e) =>
                          patchDraft(path.id, { level: e.target.value })
                        }
                      >
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </AdminSelect>
                    </div>

                    <PathCourseEditor
                      path={path}
                      courses={courses}
                      updatePath={updatePath}
                    />
                  </div>
                )}
              </AdminCard>
            </FadeIn>
          );
        })}
      </FadeIn>
    </div>
  );
}
