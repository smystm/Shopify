import { FolderOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import EmptyState from "@/app/components/ui/EmptyState"
import { fa } from "@/app/lib/i18n/fa"

interface ProductsEmptyStateProps {
   variant: "no-products" | "page-out-of-range"
   onGoToFirstPage?: () => void
}

/** Thin wrapper over the shared <EmptyState> — see ui/EmptyState.tsx. */
export default function ProductsEmptyState({ variant, onGoToFirstPage }: ProductsEmptyStateProps) {
   if (variant === "page-out-of-range") {
      return (
         <EmptyState
            icon={<ArrowPathIcon className="h-6 w-6" aria-hidden="true" />}
            title={fa.admin.productsEmpty.outOfRangeTitle}
            body={fa.admin.productsEmpty.outOfRangeBody}
            tone="brand"
            action={onGoToFirstPage ? { label: fa.admin.productsEmpty.goToFirstPage, onClick: onGoToFirstPage } : undefined}
         />
      )
   }

   return (
      <EmptyState
         icon={<FolderOpenIcon className="h-6 w-6" aria-hidden="true" />}
         title={fa.admin.productsEmpty.noProductsTitle}
         body={fa.admin.productsEmpty.noProductsBody}
         tone="accent"
      />
   )
}