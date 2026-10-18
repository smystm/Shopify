"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import ProductDialog, { type ProductFormValues } from "./ProductDialog"
import type { AdminProduct } from "@/app/contracts/products"
import { updateProduct } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

interface ProductEditDialogProps {
    product: AdminProduct
    onClose: () => void
    onUpdated: (product: AdminProduct) => void
}

export default function ProductEditDialog({ product, onClose, onUpdated }: ProductEditDialogProps) {
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSave = async (values: ProductFormValues) => {
        setSaving(true)
        setSaveError(null)

        try {
            const updated = await updateProduct(product.id, {
                productNumber: values.productNumber,
                title: values.title,
                desc: values.desc,
                category: values.category,
                price: values.price,
                image: values.image,
                count: values.count,
                ...values.specs,
            })
            onUpdated(updated)
            toast.success(fa.admin.toast.updated)
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

    return (
        <ProductDialog
            open={true}
            initial={product}
            suggestedNumber=""
            onClose={onClose}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
        />
    )
}
