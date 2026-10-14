"use client"

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"

interface ConfirmProps {
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    /** Shown on the confirm button while `loading` is true. */
    loadingLabel?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function Confirm({
    open,
    title,
    message,
    confirmLabel = "تایید",
    cancelLabel = "انصراف",
    loadingLabel = "در حال انجام...",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmProps) {
    return (
        <Dialog open={open} onClose={onCancel} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0"
            />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-sm rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl shadow-navy-900/20 transition data-closed:scale-95 data-closed:opacity-0 dark:shadow-black/40"
                    >
                        <DialogTitle className="text-base font-bold text-navy-950 dark:text-white">
                            {title}
                        </DialogTitle>
                        <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-300">{message}</p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                className="rounded-full border border-navy-300 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50 dark:border-navy-600 dark:text-navy-200 dark:hover:border-brand-400 dark:hover:bg-brand-500/10"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={loading}
                                className="rounded-full bg-linear-to-l from-red-600 to-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-700/25 transition-all hover:shadow-xl disabled:opacity-50"
                            >
                                {loading ? loadingLabel : confirmLabel}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
