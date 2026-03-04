import type { Metadata } from 'next'
import { signOut } from '@/lib/auth'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata: Metadata = { title: 'Admin | Debananda Kanhar' }

async function handleSignOut() {
    'use server'
    await signOut({ redirectTo: '/admin/login' })
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar onSignOut={handleSignOut} />
            <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', background: '#0a0a0f' }}>
                {children}
            </main>
        </div>
    )
}
