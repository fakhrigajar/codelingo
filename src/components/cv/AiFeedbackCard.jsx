import ScoreRing from "./ScoreRing";

export default function AiFeedbackCard({
  hasContent,
  status,
  result,
  error,
  onAnalyze,
}) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6">
      <h3 className="text-[1.05rem] mb-1">AI Feedback</h3>
      <p className="text-[.82rem] text-ink-soft dark:text-white/50 mb-4">
        A deeper, human-style review of your CV with AI.
      </p>

      <button
        type="button"
        className="btn btn-primary w-full mb-4"
        onClick={onAnalyze}
        disabled={!hasContent || status === "loading"}
      >
        {status === "loading"
          ? "Asking Gemini..."
          : result
            ? "Re-analyze"
            : "Analyze with Gemini"}
      </button>

      {error && (
        <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">
          {error}
        </div>
      )}

      {result ? (
        <div className="flex-1 flex items-center justify-center">
          <ScoreRing score={result.score} label="Your score" size={112} />
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-[.82rem] font-bold text-ink-soft dark:text-white/60 mb-2.5">
            {hasContent ? "You'll get:" : "Upload your CV to unlock:"}
          </p>
          <ul className="space-y-2.5">
            <li className="flex gap-2.5 text-[.86rem] text-ink-soft dark:text-white/60">
              <span>🎯</span>
              <span>An overall ATS score out of 100</span>
            </li>
            <li className="flex gap-2.5 text-[.86rem] text-ink-soft dark:text-white/60">
              <span>✅</span>
              <span>What's already working well</span>
            </li>
            <li className="flex gap-2.5 text-[.86rem] text-ink-soft dark:text-white/60">
              <span>🛠️</span>
              <span>Specific, actionable improvements</span>
            </li>
            <li className="flex gap-2.5 text-[.86rem] text-ink-soft dark:text-white/60">
              <span>🔑</span>
              <span>Keywords missing for your target role</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
