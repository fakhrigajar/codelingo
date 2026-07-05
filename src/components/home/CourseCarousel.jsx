import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import CourseCard from "../courses/CourseCard";

export function ArrowIcon({ direction }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 0 1 .02 1.06L8.832 10l3.978 3.71a.75.75 0 1 1-1.02 1.1l-4.5-4.25a.75.75 0 0 1 0-1.1l4.5-4.25a.75.75 0 0 1 1.06.02Z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1-.02-1.06L11.168 10 7.19 6.29a.75.75 0 1 1 1.02-1.1l4.5 4.25a.75.75 0 0 1 0 1.1l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

const CourseCarousel = forwardRef(function CourseCarousel({ courses, onEdgeChange }, ref) {
  const trackRef = useRef(null);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el || !onEdgeChange) return;
    onEdgeChange({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, [onEdgeChange]);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, courses]);

  useImperativeHandle(ref, () => ({
    scrollPrev: () => {
      const el = trackRef.current;
      if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    },
    scrollNext: () => {
      const el = trackRef.current;
      if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    },
  }));

  return (
    <div
      ref={trackRef}
      onScroll={updateEdges}
      className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-2"
    >
      {courses.map((c) => (
        <div
          key={c.id}
          className="shrink-0 snap-start w-full sm:w-[calc(50%-10px)] desktop:w-[calc(33.333%-14px)]"
        >
          <CourseCard course={c} currentUser={null} />
        </div>
      ))}
    </div>
  );
});

export default CourseCarousel;
