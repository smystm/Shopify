"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import Confirm from "@/app/components/ui/Confirm"
import type { AdminProduct } from "@/app/contracts/products"
import { deleteProduct } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

interface ProductDeleteDialogProps {
    product: AdminProduct | null
    onClose: () => void
    onDeleted: (id: number) => void
}

export default function ProductDeleteDialog({ product, onClose, onDeleted }: ProductDeleteDialogProps) {
    const [deleting, setDeleting] = useState(false)

    if (!product) return null

    const handleConfirm = async () => {
        setDeleting(true)
        try {
            await deleteProduct(product.id)
            onDeleted(product.id)
            toast.success(fa.admin.toast.deleted)
            onClose()
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err)
            toast.error(fa.admin.toast.deleteFailed.replace("{reason}", reason))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Confirm
            open={true}
            title={fa.admin.confirm.deleteTitle}
            message={fa.admin.confirm.deleteMessage.replace("{title}", product.title)}
            confirmLabel={fa.admin.confirm.deleteLabel}
            cancelLabel={fa.admin.dialog.cancel}
            loadingLabel={fa.admin.confirm.deleting}
            loading={deleting}
            onConfirm={handleConfirm}
            onCancel={onClose}
        />
    )
}
