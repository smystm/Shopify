import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import AdminShell from "@/app/components/admin/AdminShell"


interface Props {
    children : ReactNode
}

const AdminPanelLayout = async ({ children } : Props) => {
    // Protected group: same cookie-presence rule as panel/layout.tsx.
    const cookieStore = await cookies()
    if (!cookieStore.get("shopy-token")?.value) {
        redirect("/login")
    }

    return <AdminShell>{children}</AdminShell>
} 


export default AdminPanelLayout;