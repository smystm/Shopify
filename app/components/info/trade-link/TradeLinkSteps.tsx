"use client"

import { ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/outline"
import StepList, { type StepItem } from "@/app/components/ui/StepList"
import { fa } from "@/app/lib/i18n/fa"

const STEP_ICONS = [ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, LinkIcon, DocumentDuplicateIcon] as const

/**
 * The four steps of creating a trade link.
 *
 * Four columns at lg rather than the home page's three - the steps are short
 * and sequential, and a single row makes the sequence easier to follow than a
 * row of three with one orphaned below it.
 */
export default function TradeLinkSteps() {
   const copy = fa.info.tradeLink

   const steps: StepItem[] = copy.steps.map((step, i) => ({ ...step, Icon: STEP_ICONS[i] }))

   return <StepList title={copy.stepsTitle} subtitle={copy.stepsSubtitle} steps={steps} columns={4} />
}
