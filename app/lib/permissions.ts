import type { AdminProduct } from "@/app/contracts/products"

// These are the four access levels stored on each user.
export type Permission = "ReadOnly" | "FullAcc" | "WriteDeleteEditSelfAdds" | "NoAccess"

// Admin product/user pages are visible to anyone except NoAccess users.
export function canViewAdmin(permission?: Permission | null) {
   return permission === "ReadOnly" || permission === "FullAcc" || permission === "WriteDeleteEditSelfAdds"
}

// Full access users can create products, and self-add users can also create their own.
export function canCreateProduct(permission?: Permission | null) {
   return permission === "FullAcc" || permission === "WriteDeleteEditSelfAdds"
}

// A self-add user can edit/delete only rows where they are the creator.
export function canModifyProduct(permission: Permission | null | undefined, currentUserId: number | undefined, product: AdminProduct) {
   if (permission === "FullAcc") return true
   if (permission !== "WriteDeleteEditSelfAdds" || currentUserId === undefined) return false
   return product.created_by !== null && product.created_by !== undefined && Number(product.created_by) === Number(currentUserId)
}
