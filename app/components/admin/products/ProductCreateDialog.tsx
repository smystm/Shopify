"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import ProductDialog, { type ProductFormValues } from "./ProductDialog"
import type { AdminProduct } from "@/app/contracts/products"
import { createProduct } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

interface ProductCreateDialogProps {
    open: boolean
    suggestedNumber: string
    onClose: () => void
    onCreated: (product: AdminProduct) => void
}

export default function ProductCreateDialog({ open, suggestedNumber, onClose, onCreated }: ProductCreateDialogProps) {
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSave = async (values: ProductFormValues) => {
        setSaving(true)
        setSaveError(null)

        try {
            const created = await createProduct({
                productNumber: values.productNumber,
                title: values.title,
                desc: values.desc,
                category: values.category,
                price: values.price,
                image: values.image,
                count: values.count,
                ...values.specs,
            })
            onCreated(created)
            toast.success(fa.admin.toast.added)
            onClose()
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err)
            const message = fa.admin.toast.saveFailed.replace("{reason}", reason)
            setSaveError(message)
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <ProductDialog
            open={true}
            initial={null}
            suggestedNumber={suggestedNumber}
            onClose={onClose}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
        />
    )
}
