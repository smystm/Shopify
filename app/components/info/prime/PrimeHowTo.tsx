"use client"

import { ChatBubbleLeftRightIcon, CheckBadgeIcon, DevicePhoneMobileIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import StepList, { type StepItem } from "@/app/components/ui/StepList"
import { fa } from "@/app/lib/i18n/fa"

const STEP_ICONS = [GlobeAltIcon, DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon] as const

/** The real purchase path, on the shared numbered rail. */
export default function PrimeHowTo() {
   const copy = fa.info.prime

   const steps: StepItem[] = copy.steps.map((step, i) => ({ ...step, Icon: STEP_ICONS[i] }))

   return <StepList title={copy.stepsTitle} subtitle={copy.stepsSubtitle} steps={steps} columns={4} />
}
