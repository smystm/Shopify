"use client"

import { useState } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { ShieldCheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import type { Permission } from "@/app/lib/permissions"
import type { AdminUser } from "./UsersTable"
import { setUserPermission } from "@/app/helpers/adminUsersApi"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The four permission levels, in ascending order of power — the order the
 * picker lists them, so the form reads as a ladder rather than a scramble.
 */
const LEVELS: Permission[] = ["NoAccess", "ReadOnly", "WriteDeleteEditSelfAdds", "FullAcc"]

interface PermissionDialogProps {
   user: AdminUser
   onClose: () => void
   onSaved: (user: AdminUser, permission: Permission) => void
}

export default function PermissionDialog({ user, onClose, onSaved }: PermissionDialogProps) {
   const prefersReduced = useReducedMotion()
   const [permission, setPermission] = useState<Permission>(user.permission ?? "NoAccess")
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const isUnchanged = permission === (user.permission ?? "NoAccess")

   const handleSave = async () => {
      setSaving(true)
      setError(null)

      try {
         await setUserPermission(user.id, permission)
         onSaved(user, permission)
      } catch (err) {
         const reason = err instanceof Error ? err.message : String(err)
         const message = fa.admin.users.permissionSaveFailed.replace("{reason}", reason)
         setError(message)
      } finally {
         setSaving(false)
      }
   }

   return (
      <Dialog open={true} onClose={onClose} className="relative z-50">
         <DialogBackdrop
            transition
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0"
         />
         <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
               <DialogPanel
                  transition
                  className="w-full max-w-md rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl shadow-navy-900/20 transition data-closed:scale-95 data-closed:opacity-0 dark:shadow-black/40"
               >
                  <div className="flex items-start justify-between gap-4">
                     <div>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-navy-950 dark:text-white">
                           <ShieldCheckIcon className="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                           {fa.admin.users.permissionDialogTitle}
                        </DialogTitle>
                        <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
                           {fa.admin.users.permissionDialogFor.replace("{name}", user.name || `#${user.id}`)}
                        </p>
                     </div>
                     <button
                        type="button"
                        onClick={onClose}
                        aria-label={fa.admin.dialog.close}
                        className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:hover:bg-navy-800 dark:hover:text-brand-300"
                     >
                        <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                     </button>
                  </div>

                  <fieldset className="mt-5 space-y-2">
                     <legend className="sr-only">{fa.admin.users.permissionDialogTitle}</legend>
                     {LEVELS.map((level) => {
                        const selected = permission === level
                        return (
                           <motion.label
                              key={level}
                              whileHover={prefersReduced ? undefined : { x: -3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                                 selected
                                    ? "border-brand-500/50 bg-brand-50 dark:border-brand-400/40 dark:bg-brand-500/10"
                                    : "border-border-subtle bg-surface hover:border-brand-400/60"
                              }`}
                           >
                              <input
                                 type="radio"
                                 name={`permission-${user.id}`}
                                 value={level}
                                 checked={selected}
                                 onChange={() => setPermission(level)}
                                 className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                              />
                              <span className="min-w-0">
                                 <span className="block text-sm font-bold text-navy-950 dark:text-white" dir="ltr">
                                    {level}
                                 </span>
                                 <span className="mt-0.5 block text-xs text-navy-500 dark:text-navy-400">
                                    {fa.admin.users.permissionDescriptions[level]}
                                 </span>
                                 <span className="mt-0.5 block text-xs font-semibold text-brand-700 dark:text-brand-300">
                                    {fa.panel.roles[level]}
                                 </span>
                              </span>
                           </motion.label>
                        )
                     })}
                  </fieldset>

                  {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

                  <div className="mt-5 flex justify-end gap-2">
                     <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-navy-300 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-navy-600 dark:text-navy-200 dark:hover:border-brand-400 dark:hover:bg-brand-500/10"
                     >
                        {fa.admin.dialog.cancel}
                     </button>
                     <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || isUnchanged}
                        className="rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                     >
                        {saving ? fa.admin.users.permissionSaving : fa.admin.users.permissionSave}
                     </button>
                  </div>
               </DialogPanel>
            </div>
         </div>
      </Dialog>
   )
}
