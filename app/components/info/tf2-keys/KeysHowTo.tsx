"use client"

import { ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon, DevicePhoneMobileIcon, LinkIcon } from "@heroicons/react/24/outline"
import StepList, { type StepItem } from "@/app/components/ui/StepList"
import { fa } from "@/app/lib/i18n/fa"

const STEP_ICONS = [DevicePhoneMobileIcon, LinkIcon, ClipboardDocumentCheckIcon, ChatBubbleLeftRightIcon] as const

/**
 * The prerequisites a key delivery actually needs, rather than a generic
 * three-step flow: a verified account, a saved trade link, an order, then the
 * key itself.
 */
export default function KeysHowTo() {
   const copy = fa.info.tf2Keys

   const steps: StepItem[] = copy.steps.map((step, i) => ({ ...step, Icon: STEP_ICONS[i] }))

   return <StepList title={copy.stepsTitle} subtitle={copy.stepsSubtitle} steps={steps} columns={4} />
}
