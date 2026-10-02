"use client"

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"

interface ConfirmProps {
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function Confirm({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmProps) {
    return (
        <Dialog open={open} onClose={onCancel} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-zinc-950/60 transition-opacity duration-200 data-closed:opacity-0"
            />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl ring-1 ring-zinc-200 transition data-closed:scale-95 data-closed:opacity-0 dark:bg-zinc-950 dark:ring-zinc-800"
                    >
                        <DialogTitle className="text-base font-semibold text-zinc-950 dark:text-white">
                            {title}
                        </DialogTitle>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={loading}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400"
                            >
                                {loading ? "Deleting..." : confirmLabel}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
