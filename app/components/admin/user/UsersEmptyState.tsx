import { UserGroupIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import EmptyState from "@/app/components/ui/EmptyState"
import { fa } from "@/app/lib/i18n/fa"

interface UsersEmptyStateProps {
   variant: "no-users" | "page-out-of-range"
   onGoToFirstPage?: () => void
}

/** Thin wrapper over the shared <EmptyState> — see ui/EmptyState.tsx. */
export default function UsersEmptyState({ variant, onGoToFirstPage }: UsersEmptyStateProps) {
   if (variant === "page-out-of-range") {
      return (
         <EmptyState
            icon={<ArrowPathIcon className="h-6 w-6" aria-hidden="true" />}
            title={fa.admin.usersEmpty.outOfRangeTitle}
            body={fa.admin.usersEmpty.outOfRangeBody}
            tone="brand"
            action={onGoToFirstPage ? { label: fa.admin.usersEmpty.goToFirstPage, onClick: onGoToFirstPage } : undefined}
         />
      )
   }

   return (
      <EmptyState
         icon={<UserGroupIcon className="h-6 w-6" aria-hidden="true" />}
         title={fa.admin.usersEmpty.noUsersTitle}
         body={fa.admin.usersEmpty.noUsersBody}
         tone="accent"
      />
   )
}