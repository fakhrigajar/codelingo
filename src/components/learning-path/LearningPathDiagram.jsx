import { useRef } from 'react'
import PathArrow from './PathArrow'

// A4 at 96 CSS px/in, matching the `@page { size: A4 }` rule in index.css.
const PAGE_HEIGHT_PX = 1123
const PRINT_AREA_PADDING_PX = 48 // 24px top + 24px bottom, set in .print-area

export default function LearningPathDiagram({ goal, steps }) {
  const containerRef = useRef(null)

  const resetPagination = () => {
    const container = containerRef.current
    if (!container) return
    container.querySelectorAll('.path-step').forEach((el) => {
      el.style.marginTop = ''
      el.style.breakBefore = ''
      el.style.pageBreakBefore = ''
      const arrow = el.querySelector('.path-arrow')
      if (arrow) arrow.style.display = ''
    })
    const goalEl = container.querySelector('.path-goal')
    if (goalEl) goalEl.style.marginTop = ''
  }

  const paginate = () => {
    const container = containerRef.current
    if (!container) return
    resetPagination()

    const stepEls = Array.from(container.querySelectorAll('.path-step'))
    if (stepEls.length === 0) return

    const contentHeight = PAGE_HEIGHT_PX - PRINT_AREA_PADDING_PX
    const goalEl = container.querySelector('.path-goal')

    let used = 0
    if (goalEl) {
      const mb = parseFloat(getComputedStyle(goalEl).marginBottom) || 0
      used += goalEl.getBoundingClientRect().height + mb
    }

    let splitIndex = stepEls.length
    for (let i = 0; i < stepEls.length; i++) {
      const h = stepEls[i].getBoundingClientRect().height
      if (i > 0 && used + h > contentHeight) {
        splitIndex = i
        break
      }
      used += h
    }

    if (splitIndex < stepEls.length) {
      const lastPage1Step = stepEls[splitIndex - 1]
      const arrow = lastPage1Step.querySelector('.path-arrow')
      if (arrow) {
        used -= arrow.getBoundingClientRect().height
        arrow.style.display = 'none'
      }

      const nextStep = stepEls[splitIndex]
      nextStep.style.breakBefore = 'page'
      nextStep.style.pageBreakBefore = 'always'
      nextStep.style.marginTop = '24px'
    }

    const leftover = Math.max(contentHeight - used, 0)
    const anchor = goalEl || stepEls[0]
    anchor.style.marginTop = `${leftover / 2}px`
  }

  const handlePrint = () => {
    paginate()
    // Give the browser a frame to apply the inline styles before the print
    // dialog snapshots the layout.
    requestAnimationFrame(() => window.print())
  }

  return (
    <div>
      <div className="flex justify-center mb-5 print:hidden">
        <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}>
          ⬇ Download as PDF
        </button>
      </div>

      <div ref={containerRef} className="print-area max-w-[520px] mx-auto">
        {goal && (
          <p className="path-goal text-center text-[.85rem] font-bold text-ink-soft dark:text-white/50 mb-5">
            Your path to: <span className="text-violet">{goal}</span>
          </p>
        )}

        {steps.map((step, i) => (
          <div key={i} className="path-step">
            <div className="relative bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[18px] p-5">
              <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-violet text-white flex items-center justify-center font-mono font-bold text-[.78rem] shadow-[0_2px_6px_rgba(140,122,230,.5)]">
                {i + 1}
              </span>
              <h3 className="text-[1.1rem] mb-1">{step.title}</h3>
              {step.description && (
                <p className="text-ink-soft dark:text-white/60 text-[.88rem]">{step.description}</p>
              )}
            </div>

            {i < steps.length - 1 && (
              <div className="path-arrow flex justify-center">
                <PathArrow />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
