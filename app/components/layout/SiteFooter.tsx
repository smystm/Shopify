"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { ArrowUpLeftIcon, BanknotesIcon, BoltIcon, LifebuoyIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import { SUPPORT_TELEGRAM_URL } from "@/app/lib/support"
import BrandMark from "./BrandMark"
import Reveal from "@/app/components/ui/Reveal"

type TrustKey = keyof typeof fa.footer.trust

const TRUST: Array<{ key: TrustKey; Icon: typeof BanknotesIcon }> = [
   { key: "bestPrice", Icon: BanknotesIcon },
   { key: "instantDelivery", Icon: BoltIcon },
   { key: "supportHours", Icon: LifebuoyIcon },
   { key: "security", Icon: ShieldCheckIcon },
]

/**
 * Trust badges.
 *
 * `src`/`href` are config rather than copy, so they live here. The Enamad seal
 * is currently a local PLACEHOLDER with **no** `href`: a seal is issued per
 * domain, so it cannot be reused from another site, and linking to `#` would be
 * a dead link. Once you have your own seal, set `href` to the trustseal.ir page
 * and `src` to `https://trustseal.enamad.ir/logo.aspx?id=<id>&Code=<code>` —
 * the badge turns into a link on its own.
 */
const BADGES: Array<{
   key: "enamad" | "zibal"
   label: string
   src: string
   href?: string
   width: number
   height: number
}> = [
   {
      key: "enamad",
      label: fa.footer.badges.enamadLabel,
      src: "/brand/enamad.svg",
      width: 72,
      height: 72,
   },
   {
      key: "zibal",
      label: fa.footer.badges.zibalLabel,
      src: "/brand/zibal.svg",
      href: "https://zibal.ir/",
      width: 128,
      height: 40,
   },
]

interface FooterLink {
   label: string
   href: string
   /** Opens in a new tab with rel="noopener noreferrer" and an icon. */
   external?: boolean
}

/**
 * Footer navigation.
 *
 * Every entry is a local route — the only exception is Telegram, which has to
 * leave the site. Routes that are not built yet render a real placeholder page
 * (see `app/(myPages)/(info)`) rather than a 404, so nothing here dead-ends.
 */
const GROUPS: Array<{ title: string; links: FooterLink[] }> = [
   {
      title: fa.footer.groups.buySell,
      links: [
         { label: fa.footer.links.buySkins, href: "/products" },
         { label: fa.footer.links.sellSkins, href: "/sell" },
         { label: fa.footer.links.tf2Keys, href: "/tf2-keys" },
         { label: fa.footer.links.buyPrime, href: "/prime" },
         { label: fa.footer.links.knives, href: "/knives" },
         { label: fa.footer.links.gloves, href: "/gloves" },
      ],
   },
   {
      title: fa.footer.groups.account,
      links: [
         { label: fa.footer.links.profile, href: "/panel/profile" },
         { label: fa.footer.links.wallet, href: "/panel/wallet" },
         { label: fa.footer.links.withdrawals, href: "/panel/wallet/withdraw" },
         { label: fa.footer.links.orders, href: "/panel/orders" },
         // Explains the concept and links onward to the profile editor.
         { label: fa.footer.links.tradeLink, href: "/trade-link" },
         { label: fa.footer.links.verification, href: "/verify" },
      ],
   },
   {
      title: fa.footer.groups.support,
      links: [
         { label: fa.footer.links.contact, href: "/contact" },
         { label: fa.footer.links.faq, href: "/#faq" },
         { label: fa.footer.links.rules, href: "/rules" },
         { label: fa.footer.links.telegram, href: SUPPORT_TELEGRAM_URL, external: true },
         { label: fa.footer.links.whatIsTradeLink, href: "/trade-link" },
      ],
   },
   {
      title: fa.footer.groups.about,
      links: [
         { label: fa.footer.links.aboutUs, href: "/about" },
         { label: fa.footer.links.blog, href: "/blog" },
         { label: fa.footer.links.contact, href: "/contact" },
         { label: fa.footer.links.whyVerification, href: "/verify" },
      ],
   },
]

/**
 * Site footer for the marketing pages (home and /products).
 *
 * A deep navy band in BOTH themes rather than a themed surface: it reads as a
 * deliberate end to the page, and — more practically — it does not flip to a
 * different treatment when the visitor toggles the theme while scrolled to the
 * bottom. Same gradient as CtaBand, so the two bookend the page.
 */
export default function SiteFooter() {
   const prefersReduced = useReducedMotion()

   // Scroll-driven hairline, mirroring the header. Opacity + scale only, so it
   // behaves the same in RTL and LTR.
   const { scrollY } = useScroll()
   const hairlineScale = useTransform(scrollY, [0, 60], [0, 1])
   const hairlineOpacity = useTransform(hairlineScale, [0, 0.6, 1], [0, 0.45, 1])

   return (
      <footer
         dir="rtl"
         lang="fa"
         className="relative overflow-hidden border-t border-navy-800 bg-linear-to-b from-navy-900 via-navy-950 to-navy-900 font-vazirmatn"
      >
         {/* Brand + accent glows, same treatment as CtaBand. */}
         <div aria-hidden="true" className="pointer-events-none absolute -top-40 -inset-e-24 h-72 w-72 rounded-full bg-brand-500/12 blur-[100px]" />
         <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -inset-s-24 h-72 w-72 rounded-full bg-accent-500/10 blur-[100px]" />

         {/* Gradient hairline that fades in on scroll, like the header. */}
         <motion.span
            aria-hidden="true"
            style={{ scaleX: hairlineScale, opacity: hairlineOpacity }}
            className="absolute inset-x-0 top-0 h-px origin-right bg-linear-to-l from-brand-500 via-brand-400 to-accent-400 rtl:origin-left"
         />

         <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8">
            {/* ---------------------------- Trust strip ---------------------------- */}
            <section className="border-b border-navy-800/80 pt-10 pb-7">
               <Reveal className="mx-auto max-w-2xl text-center">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">{fa.footer.trustTitle}</h2>
               </Reveal>

               <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {TRUST.map(({ key, Icon }, i) => (
                     <Reveal key={key} delay={i * 0.08} className="h-full">
                        <motion.div
                           whileHover={prefersReduced ? undefined : { y: -6 }}
                           transition={{ type: "spring", stiffness: 320, damping: 24 }}
                           className="group h-full overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40 p-5 transition-colors hover:border-brand-400/50"
                        >
                           <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                           </span>
                           <h3 className="mt-4 text-sm font-bold text-white">{fa.footer.trust[key].title}</h3>
                           <p className="mt-2 text-[13px] leading-6 text-navy-300">{fa.footer.trust[key].body}</p>
                        </motion.div>
                     </Reveal>
                  ))}
               </div>
            </section>

            {/* ------------------------- Brand + navigation ------------------------ */}
            <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
               <Reveal className="sm:col-span-2 lg:col-span-1">
                  <div className="flex flex-col items-start gap-4">
                     {/* Reuse the header's mark so the lockup stays identical. */}
                     <BrandMark />
                     <p className="text-base font-extrabold text-white">{fa.footer.brand.tagline}</p>
                     <p className="max-w-xs text-[13px] leading-7 text-navy-300">{fa.footer.brand.description}</p>
                  </div>
               </Reveal>

               {GROUPS.map((group, i) => (
                  <Reveal key={group.title} delay={0.06 * (i + 1)} className="h-full">
                     <nav aria-label={group.title}>
                        <h3 className="text-sm font-bold text-white">{group.title}</h3>
                        <ul className="mt-4 space-y-3">
                           {group.links.map((link) => (
                              <li key={`${group.title}-${link.label}`}>
                                 <FooterLinkItem link={link} />
                              </li>
                           ))}
                        </ul>
                     </nav>
                  </Reveal>
               ))}
            </div>

            {/* ------------------------------ Badges ------------------------------ */}
            <section className="border-t border-navy-800/80 py-7">
               <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                  <h3 className="text-center text-sm font-bold text-navy-200 sm:text-start">{fa.footer.badges.title}</h3>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                     {BADGES.map((badge) => {
                        const inner = (
                           <>
                              <Image
                                 src={badge.src}
                                 alt={badge.label}
                                 width={badge.width}
                                 height={badge.height}
                                 className="h-auto opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                              />
                              <span className="text-xs font-bold text-navy-200">{badge.label}</span>
                           </>
                        )

                        const shell =
                           "group flex items-center gap-3 rounded-2xl border border-navy-800 bg-navy-900/50 px-4 py-3"

                        // A badge with no href yet is not a link — see BADGES.
                        return badge.href ? (
                           <a
                              key={badge.key}
                              href={badge.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${shell} transition-colors hover:border-brand-400/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400`}
                           >
                              {inner}
                           </a>
                        ) : (
                           <div key={badge.key} className={shell}>
                              {inner}
                           </div>
                        )
                     })}
                  </div>
               </div>
            </section>

            {/* ------------------------------ Bottom bar ---------------------------- */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-navy-800/80 py-6 sm:flex-row">
               <motion.p
                  initial={prefersReduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-1.5 text-sm font-bold text-navy-200"
               >
                  {fa.footer.madeWithBefore}
                  {/* The heart is a separate node so it can pulse; the words live in the dictionary. */}
                  <motion.span
                     aria-hidden="true"
                     animate={prefersReduced ? undefined : { scale: [1.3, 1.18, 1] }}
                     transition={prefersReduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <span className="text-shadow-brand-400">♥</span>
                  </motion.span>
                  {fa.footer.madeWithAfter}
               </motion.p>

               <p className="text-center text-xs text-navy-400 sm:text-end">
                  {fa.footer.copyrightPrefix} © {fa.footer.copyrightYear} {fa.header.brand}
               </p>
            </div>
         </div>
      </footer>
   )
}

/* ------------------------------------------------------------------ pieces */

/**
 * One nav link.
 *
 * On hover the label changes colour and an underline scales in beneath it.
 * The underline is pure CSS — no JS, so it needs no reduced-motion branch and
 * `prefers-reduced-motion` stops the transition on its own.
 *
 * `origin-left` grows the line left→right under LTR; `rtl:origin-right` mirrors
 * it so it still grows from the text's own start edge under RTL.
 */
function FooterLinkItem({ link }: { link: FooterLink }) {
   const inner = (
      <>
         <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 rounded-full bg-brand-400 transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right"
         />
         <span className="relative flex items-center gap-1">
            {link.label}
            {link.external ? (
               <ArrowUpLeftIcon className="h-3 w-3 shrink-0 text-navy-500 transition-colors group-hover:text-brand-400" aria-hidden="true" />
            ) : null}
         </span>
      </>
   )

   const className =
      "group relative inline-flex items-center text-[13px] text-navy-300 transition-colors hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"

   if (link.external) {
      return (
         <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            // The icon alone does not convey "new tab" to a screen reader.
            aria-label={`${link.label} — ${fa.footer.opensInNewTab}`}
         >
            {inner}
         </a>
      )
   }

   return (
      <Link href={link.href} className={className}>
         {inner}
      </Link>
   )
}