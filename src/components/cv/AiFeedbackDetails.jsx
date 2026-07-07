import AiFeedbackSummary from './AiFeedbackSummary'

export default function AiFeedbackDetails({ result }) {
  if (!result) return null

  const { strengths, improvements, keywordGaps } = result
  const hasGrid = strengths.length > 0 || improvements.length > 0 || keywordGaps.length > 0

  return (
    <div className="space-y-6">
      <AiFeedbackSummary result={result} />

      {hasGrid && (
        <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6 grid sm:grid-cols-2 desktop:grid-cols-3 gap-x-8 gap-y-6">
          {strengths.length > 0 && (
            <div>
              <h4 className="font-bold text-[.9rem] mb-2.5">Strengths</h4>
              <ul className="space-y-1.5">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[.86rem]">
                    <span className="text-mint shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvements.length > 0 && (
            <div>
              <h4 className="font-bold text-[.9rem] mb-2.5">Suggested improvements</h4>
              <ul className="space-y-1.5">
                {improvements.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[.86rem]">
                    <span className="text-coral shrink-0">!</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {keywordGaps.length > 0 && (
            <div>
              <h4 className="font-bold text-[.9rem] mb-2.5">Keyword gaps</h4>
              <div className="flex flex-wrap gap-2">
                {keywordGaps.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md font-mono text-[.72rem] font-bold bg-bg dark:bg-white/10"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
