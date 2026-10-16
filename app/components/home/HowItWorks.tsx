import { UserPlusIcon, CursorArrowRaysIcon, BanknotesIcon } from "@heroicons/react/24/outline"
import StepList, { type StepItem } from "@/app/components/ui/StepList"
import { fa } from "@/app/lib/i18n/fa"

const STEPS = [
   { key: "register", Icon: UserPlusIcon },
   { key: "choose", Icon: CursorArrowRaysIcon },
   { key: "receive", Icon: BanknotesIcon },
] as const

export default function HowItWorks() {
   const steps: StepItem[] = STEPS.map(({ key, Icon }) => ({ ...fa.home.howItWorks.steps[key], Icon }))

   return (
      <StepList title={fa.home.howItWorks.title} subtitle={fa.home.howItWorks.subtitle} steps={steps} columns={3} />
   )
}
