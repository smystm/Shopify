"use client"

import { motion, useReducedMotion } from "motion/react"
import type { AdminProduct } from "@/app/contracts/products"
import { specSectionsFor } from "@/app/lib/productSpecs"
import SpecSectionBlock from "./SpecSectionBlock"

/**
 * Every specification this item has, assembled.
 *
 * The resolver decides what exists; this only lays out the answer. That split is
 * why a case page has no float meter and a weapon page does - not because
 * anything here knows what a case is, but because the case has nothing to fill
 * one in with.
 */
export default function SpecsPanel({ product }: { product: AdminProduct }) {
   const prefersReduced = useReducedMotion()
   const sections = specSectionsFor(product)

   if (sections.length === 0) return null

   return (
      <motion.div
         initial={prefersReduced ? false : { opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, margin: "-60px" }}
         transition={{ duration: 0.4 }}
         className="grid gap-4 md:grid-cols-2"
      >
         {sections.map((section, index) => (
            <SpecSectionBlock key={section.id} section={section} index={index} />
         ))}
      </motion.div>
   )
}