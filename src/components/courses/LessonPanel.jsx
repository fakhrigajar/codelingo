import { useEffect, useRef, useState } from "react";
import { BookOpen, Lightbulb, Check, ArrowRight, Video } from "lucide-react";
import { getLessonBlocks } from "../../lib/lessonBlocks";
import { getYouTubeVideoId, getVideoEmbedUrl } from "../../lib/videoEmbed";
import { loadYouTubeIframeApi } from "../../lib/youtubeApi";
import QuizPanel from "./QuizPanel";
import LessonDiscussion from "./LessonDiscussion";

function useLatestRef(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

function YouTubePlayer({
  videoId,
  value,
  onReady,
  onDuration,
  onPlay,
  onPause,
  onEnded,
}) {
  const [frameId] = useState(
    () => `yt-${videoId}-${Math.random().toString(36).slice(2, 8)}`,
  );
  const [apiFailed, setApiFailed] = useState(false);
  const playerRef = useRef(null);
  const onReadyRef = useLatestRef(onReady);
  const onDurationRef = useLatestRef(onDuration);
  const onPlayRef = useLatestRef(onPlay);
  const onPauseRef = useLatestRef(onPause);
  const onEndedRef = useLatestRef(onEnded);

  useEffect(() => {
    let cancelled = false;
    const failTimer = setTimeout(() => {
      if (!cancelled) setApiFailed(true);
    }, 6000);

    loadYouTubeIframeApi().then((YT) => {
      clearTimeout(failTimer);
      if (cancelled) return;
      playerRef.current = new YT.Player(frameId, {
        videoId,
        playerVars: { rel: 0 },
        events: {
          onReady: (e) => {
            onReadyRef.current();
            onDurationRef.current(e.target.getDuration());
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) onPlayRef.current();
            else if (e.data === YT.PlayerState.ENDED) {
              onPauseRef.current();
              onEndedRef.current();
            } else onPauseRef.current();
          },
          onError: () => setApiFailed(true),
        },
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      playerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId, videoId]);

  if (apiFailed) {
    return (
      <iframe
        src={getVideoEmbedUrl(value)}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => onReadyRef.current()}
        className="w-full h-full border-0"
      />
    );
  }

  return <div id={frameId} className="w-full h-full" />;
}

function Html5Video({ value, onReady, onDuration, onPlay, onPause, onEnded }) {
  return (
    <video
      src={value}
      controls
      onLoadedMetadata={(e) => onDuration(e.target.duration)}
      onLoadedData={onReady}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      className="w-full h-full"
    />
  );
}

function VideoBlock({ value, onDuration, onTick, onEnded }) {
  const [loaded, setLoaded] = useState(false);
  const tickTimerRef = useRef(null);
  const onTickRef = useLatestRef(onTick);
  const youtubeId = getYouTubeVideoId(value);

  const startTicking = () => {
    stopTicking();
    tickTimerRef.current = setInterval(() => onTickRef.current(1), 1000);
  };
  const stopTicking = () => {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    tickTimerRef.current = null;
  };
  const handleEnded = () => {
    stopTicking();
    onEnded();
  };
  useEffect(() => () => stopTicking(), []);

  return (
    <div className="relative w-full aspect-video rounded-xl mb-4 overflow-hidden bg-black">
      {!loaded && (
        <div className="absolute inset-0 bg-line dark:bg-white/10 animate-pulse flex items-center justify-center">
          <Video size={40} className="text-ink-soft/40 dark:text-white/30" />
        </div>
      )}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        {youtubeId ? (
          <YouTubePlayer
            videoId={youtubeId}
            value={value}
            onReady={() => setLoaded(true)}
            onDuration={onDuration}
            onPlay={startTicking}
            onPause={stopTicking}
            onEnded={handleEnded}
          />
        ) : (
          <Html5Video
            value={value}
            onReady={() => setLoaded(true)}
            onDuration={onDuration}
            onPlay={startTicking}
            onPause={stopTicking}
            onEnded={handleEnded}
          />
        )}
      </div>
    </div>
  );
}

function LessonBlock({ block }) {
  if (block.type === "image") {
    return block.value ? (
      <img
        src={block.value}
        alt=""
        className="w-full rounded-xl mb-4 object-cover"
      />
    ) : null;
  }
  if (block.type === "fact") {
    return block.value ? (
      <div className="bg-[#FFF3D6] text-[#8A5B00] dark:bg-[#3A2E12] dark:text-[#FFD98A] rounded-xl px-4 py-3.5 mb-4 flex items-start gap-2">
        <Lightbulb size={16} className="shrink-0 mt-0.5" /> Fun fact:{" "}
        {block.value}
      </div>
    ) : null;
  }
  return <p className="text-[1.02rem] mb-4">{block.value}</p>;
}

function NextButton({ nextLesson, onNext }) {
  return (
    <button
      type="button"
      onClick={onNext}
      className="btn btn-gold inline-flex items-center justify-center gap-1.5"
    >
      {nextLesson ? `Next: ${nextLesson.title}` : "Back to overview"}
      <ArrowRight size={16} />
    </button>
  );
}

export default function LessonPanel({
  course,
  lesson,
  currentUser,
  onComplete,
  nextLesson,
  onNext,
  onVideoProgress,
  onVideoDuration,
}) {
  const done =
    currentUser && (currentUser.completed[course.id] || []).includes(lesson.id);
  const blocks = getLessonBlocks(lesson);
  const videoBlock = blocks.find((b) => b.type === "video" && b.value);

  const watchedRef = useRef(
    currentUser?.videoProgress?.[course.id]?.[lesson.id] || 0,
  );
  const [watchedSeconds, setWatchedSeconds] = useState(watchedRef.current);
  const [videoDuration, setVideoDuration] = useState(null);
  useEffect(() => {
    const initial = currentUser?.videoProgress?.[course.id]?.[lesson.id] || 0;
    watchedRef.current = initial;
    setWatchedSeconds(initial);
    setVideoDuration(null);
  }, [course.id, lesson.id]);

  useEffect(() => {
    const flush = () => {
      if (watchedRef.current > 0)
        onVideoProgress?.(lesson.id, Math.floor(watchedRef.current));
    };
    const handleVisibilityChange = () => {
      if (document.hidden) flush();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flush);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, lesson.id]);

  const handleTick = (delta) => {
    watchedRef.current += delta;
    const rounded = Math.floor(watchedRef.current);
    setWatchedSeconds(rounded);
    if (rounded % 5 === 0) onVideoProgress?.(lesson.id, rounded);
  };

  const handleDuration = (seconds) => {
    if (!seconds || !Number.isFinite(seconds)) return;
    setVideoDuration(seconds);
    onVideoDuration?.(lesson.id, Math.ceil(seconds / 60));
  };

  const handleEnded = () => {
    if (videoDuration == null) return;
    watchedRef.current = Math.max(watchedRef.current, videoDuration);
    const rounded = Math.ceil(watchedRef.current);
    setWatchedSeconds(rounded);
    onVideoProgress?.(lesson.id, rounded);
  };

  const videoWatched =
    !videoBlock ||
    (videoDuration != null && watchedSeconds >= Math.floor(videoDuration));

  if (lesson.type === "quiz") {
    return (
      <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
        <QuizPanel
          lesson={lesson}
          done={done}
          onComplete={(xp, isQuiz) => onComplete(course, lesson, xp, isQuiz)}
        />
        <div className="mt-4">
          <NextButton nextLesson={nextLesson} onNext={onNext} />
        </div>
        <LessonDiscussion course={course} lesson={lesson} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-7">
      <span className="eyebrow inline-flex items-center gap-1.5">
        <BookOpen size={13} /> lesson
      </span>
      <h2 className="text-[1.4rem] sm:text-[1.6rem] desktop:text-[1.8rem] pb-2 border-b-2 border-dashed border-line dark:border-white/10">
        {lesson.title}
      </h2>
      {blocks.map((block) => {
        if (block.type === "video") {
          return block.value ? (
            <VideoBlock
              key={block.id}
              value={block.value}
              onDuration={handleDuration}
              onTick={handleTick}
              onEnded={handleEnded}
            />
          ) : null;
        }
        return <LessonBlock key={block.id} block={block} />;
      })}
      <div className="flex justify-between gap-3">
        <button
          className={`btn ${done ? "btn-outline" : "btn-primary"} inline-flex items-center justify-center gap-1.5`}
          disabled={done || !videoWatched}
          onClick={() =>
            !done && videoWatched && onComplete(course, lesson, 10, false)
          }
        >
          {done ? (
            <>
              <Check size={16} /> Completed
            </>
          ) : videoBlock ? (
            "Submit"
          ) : (
            "Mark as complete (+10 XP)"
          )}
        </button>
        <NextButton nextLesson={nextLesson} onNext={onNext} />
      </div>
      {videoBlock && !done && !videoWatched && (
        <p className="text-[.8rem] text-ink-soft dark:text-white/50 mt-5">
          Watch the full video to unlock Submit —{" "}
          {videoDuration
            ? Math.min(100, Math.floor((watchedSeconds / videoDuration) * 100))
            : 0}
          %
        </p>
      )}
      {!currentUser && (
        <p className="text-[.82rem] text-ink-soft dark:text-white/50 mt-3">
          Log in to save your progress.
        </p>
      )}
      <LessonDiscussion course={course} lesson={lesson} />
    </div>
  );
}
