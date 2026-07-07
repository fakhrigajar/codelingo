export default function AiFeedbackSummary({ result }) {
  if (!result?.summary) return null

  return (
    <div className="bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-6">
      <h4 className="font-bold text-[.9rem] mb-2">Overview</h4>
      <p className="text-[.92rem]">{result.summary}</p>
    </div>
  )
}
