import SectionHeading from "@/app/components/ui/SectionHeading"
import BulletPanel from "@/app/components/info/BulletPanel"
import { fa } from "@/app/lib/i18n/fa"

/**
 * What to include in a support message.
 *
 * Numbered rather than ticked: this is a sequence of things to gather before
 * writing, not a checklist of things already done.
 */
export default function ContactBefore() {
   const { beforeTitle, beforeSubtitle, before } = fa.info.contact

   return (
      <section className="py-16">
         <SectionHeading title={beforeTitle} subtitle={beforeSubtitle} />
         <BulletPanel className="mx-auto mt-10 max-w-3xl" items={before} ordered />
      </section>
   )
}
