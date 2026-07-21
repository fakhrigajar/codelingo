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
import {
  getCourseUnits,
  groupLessonsByUnit,
  nextUnitNumber,
  applyUnitsToLessons,
  unitContainerId,
} from "../../lib/units";
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminButton,
  AdminImageUpload,
} from "./AdminFields";
import SortableUnitBlock from "./SortableUnitBlock";
import CourseIcon from "../courses/CourseIcon";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const AVAILABILITY = [
  { value: "available", label: "Available" },
  { value: "coming-soon", label: "Coming soon" },
];

function collisionDetection(args) {
  const draggingUnit = args.active.data.current?.type === "unit";
  const relevantTypes = draggingUnit ? ["unit"] : ["lesson", "unit-container"];
  const droppableContainers = args.droppableContainers.filter((c) =>
    relevantTypes.includes(c.data.current?.type),
  );
  return closestCenter({ ...args, droppableContainers });
}

export default function CourseEditor({ course, onChange }) {
  const [openLessonId, setOpenLessonId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const units = getCourseUnits(course);
  const groups = groupLessonsByUnit(course);

  // Every add/move/reorder goes through here so unitTitle/subUnit on each
  // lesson always stay derived from the current units list, never drift.
  const commit = (nextLessons, nextUnits = units) => {
    onChange({
      lessons: applyUnitsToLessons(nextLessons, nextUnits),
      units: nextUnits,
    });
  };

  const toggleLesson = (lessonId) => {
    setOpenLessonId((prev) => (prev === lessonId ? null : lessonId));
  };
  const updateLesson = (lessonId, patch) => {
    onChange({
      lessons: course.lessons.map((l) =>
        l.id === lessonId ? { ...l, ...patch } : l,
      ),
    });
  };
  const removeLesson = (lessonId) => {
    commit(course.lessons.filter((l) => l.id !== lessonId));
    if (openLessonId === lessonId) setOpenLessonId(null);
  };
  const addLesson = (unitNumber) => {
    const id = uid("l");
    commit([
      ...course.lessons,
      {
        id,
        type: "lesson",
        title: "New lesson",
        unit: unitNumber,
        blocks: [],
        points: 10,
      },
    ]);
    setOpenLessonId(id);
  };
  const addQuiz = (unitNumber) => {
    const id = uid("q");
    commit([
      ...course.lessons,
      {
        id,
        type: "quiz",
        title: "New quiz",
        unit: unitNumber,
        points: 20,
        questions: [
          { q: "New question?", options: ["Option A", "Option B"], correct: 0 },
        ],
      },
    ]);
    setOpenLessonId(id);
  };

  const addUnit = () => {
    const number = nextUnitNumber(units);
    commit(course.lessons, [...units, { number }]);
  };
  const removeUnit = (number) => {
    commit(
      course.lessons,
      units.filter((u) => u.number !== number),
    );
  };
  const renameUnit = (number, title) => {
    commit(
      course.lessons,
      units.map((u) => (u.number === number ? { ...u, title } : u)),
    );
  };

  const findGroup = (lessonId) =>
    groups.find((g) => g.items.some((l) => l.id === lessonId));

  const handleDragOver = ({ active, over }) => {
    if (!over || active.data.current?.type !== "lesson") return;
    const activeGroup = findGroup(active.id);
    if (!activeGroup) return;
    const overGroup =
      over.data.current?.type === "lesson"
        ? findGroup(over.id)
        : groups.find((g) => unitContainerId(g.number) === over.id);
    if (!overGroup || activeGroup.number === overGroup.number) return;

    const activeLesson = course.lessons.find((l) => l.id === active.id);
    const withoutActive = course.lessons.filter((l) => l.id !== active.id);
    let insertAt;
    if (over.data.current?.type === "lesson") {
      insertAt = withoutActive.findIndex((l) => l.id === over.id);
    } else {
      const lastItem = overGroup.items[overGroup.items.length - 1];
      insertAt = lastItem
        ? withoutActive.findIndex((l) => l.id === lastItem.id) + 1
        : withoutActive.length;
    }
    const moved = { ...activeLesson, unit: overGroup.number };
    const next = [
      ...withoutActive.slice(0, insertAt),
      moved,
      ...withoutActive.slice(insertAt),
    ];
    commit(next);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    if (active.data.current?.type === "unit") {
      if (active.id === over.id) return;
      const oldIndex = units.findIndex((u) => `unit-${u.number}` === active.id);
      const newIndex = units.findIndex((u) => `unit-${u.number}` === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(units, oldIndex, newIndex);
      const itemsByNumber = new Map(groups.map((g) => [g.number, g.items]));
      const nextLessons = [
        ...reordered.flatMap((u) => itemsByNumber.get(u.number) || []),
        ...(itemsByNumber.get(null) || []),
      ];
      commit(nextLessons, reordered);
      return;
    }

    const group = findGroup(active.id);
    if (!group) return;
    const oldIndex = group.items.findIndex((l) => l.id === active.id);
    const newIndex =
      over.data.current?.type === "lesson"
        ? group.items.findIndex((l) => l.id === over.id)
        : group.items.length - 1;
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
    const reorderedItems = arrayMove(group.items, oldIndex, newIndex);
    const nextLessons = groups.flatMap((g) =>
      g.number === group.number ? reorderedItems : g.items,
    );
    commit(nextLessons);
  };

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3">
        <AdminInput
          label="Title"
          placeholder="e.g. Python Fundamentals"
          value={course.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <AdminSelect
          label="Level"
          value={course.level}
          onChange={(e) => onChange({ level: e.target.value })}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Availability"
          value={course.availability || "available"}
          onChange={(e) => onChange({ availability: e.target.value })}
        >
          {AVAILABILITY.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </AdminSelect>
      </div>
      <div className="grid sm:grid-cols-[auto_1fr] gap-3 items-end">
        <AdminImageUpload
          label="Icon"
          value={course.icon}
          onChange={(icon) => onChange({ icon })}
          preview={
            <CourseIcon
              course={course}
              size={48}
              className="rounded-xl shrink-0"
            />
          }
        />
        <AdminInput
          label="Accent color"
          type="color"
          value={course.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="h-[42px] p-1"
        />
      </div>
      <AdminTextarea
        label="About"
        placeholder="What will learners get out of this course?"
        value={course.about}
        onChange={(e) => onChange({ about: e.target.value })}
      />

      <div className="mt-3">
        <span className="block font-bold text-[.85rem] mb-0.5 text-ink-soft dark:text-white/60">
          Units &amp; lessons ({course.lessons.length})
        </span>
        <p className="text-[.78rem] text-ink-soft/70 dark:text-white/40 mb-2">
          Drag a unit's handle to reorder units. Drag a lesson to reorder it or
          move it into a different unit.
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={groups
              .filter((g) => g.number != null)
              .map((g) => `unit-${g.number}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {groups.map((group) => (
                <SortableUnitBlock
                  key={group.number ?? "unsorted"}
                  group={group}
                  openLessonId={openLessonId}
                  onToggleLesson={toggleLesson}
                  onLessonChange={updateLesson}
                  onLessonRemove={removeLesson}
                  onRemoveUnit={
                    group.number != null && group.items.length === 0
                      ? () => removeUnit(group.number)
                      : undefined
                  }
                  onRenameUnit={
                    group.number != null
                      ? (title) => renameUnit(group.number, title)
                      : undefined
                  }
                  onAddLesson={
                    group.number != null
                      ? () => addLesson(group.number)
                      : undefined
                  }
                  onAddQuiz={
                    group.number != null
                      ? () => addQuiz(group.number)
                      : undefined
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <AdminButton variant="outline" className="mt-3" onClick={addUnit}>
          + Add unit
        </AdminButton>
      </div>
    </div>
  );
}
