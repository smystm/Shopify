"use client"

import { CheckBadgeIcon, DevicePhoneMobileIcon, KeyIcon } from "@heroicons/react/24/outline"
import StepList, { type StepItem } from "@/app/components/ui/StepList"
import { fa } from "@/app/lib/i18n/fa"

const STEP_ICONS = [DevicePhoneMobileIcon, KeyIcon, CheckBadgeIcon] as const

/** The three-step verification flow, on the shared numbered rail. */
export default function VerifySteps() {
   const copy = fa.info.verify

   const steps: StepItem[] = copy.steps.map((step, i) => ({ ...step, Icon: STEP_ICONS[i] }))

   return <StepList title={copy.stepsTitle} subtitle={copy.stepsSubtitle} steps={steps} columns={3} />
}
