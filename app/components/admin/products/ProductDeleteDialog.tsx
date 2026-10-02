"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import Confirm from "@/app/components/ui/Confirm"
import type { AdminProduct } from "@/app/contracts/products"
import { deleteProduct } from "@/app/helpers/productApi"

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
            toast.success("Product deleted successfully")
            onClose()
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err)
            toast.error(`Failed to delete product: ${reason}`)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Confirm
            open={true}
            title="Delete product"
            message={`Delete "${product.title}"? This will permanently remove it.`}
            confirmLabel="Delete"
            loading={deleting}
            onConfirm={handleConfirm}
            onCancel={onClose}
        />
    )
}
