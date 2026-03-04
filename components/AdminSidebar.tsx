'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, BarChart2, PlusCircle, LogOut, Brain, Settings } from 'lucide-react'

const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/posts', icon: FileText, label: 'All Posts' },
    { href: '/admin/posts/new', icon: PlusCircle, label: 'New Post' },
    { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function AdminSidebar({ onSignOut }: { onSignOut: () => void }) {
    const pathname = usePathname()

    return (
        <aside
            style={{
                width: '240px',
                background: '#0e0e16',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={18} color="white" />
                    </div>
                    <div>
                        <div style={{ color: '#f0f0f8', fontWeight: 700, fontSize: '14px' }}>CMS Admin</div>
                        <div style={{ color: '#5c5c70', fontSize: '11px' }}>debananda.dev</div>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px' }}>
                {navLinks.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px', borderRadius: '8px',
                                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                                marginBottom: '2px', transition: 'all 0.2s',
                                background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                                color: isActive ? '#a78bfa' : '#9898b0',
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f0f0f8' } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898b0' } }}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Link
                    href="/" target="_blank"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#9898b0', fontSize: '14px', fontWeight: 500, marginBottom: '4px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f0f0f8' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898b0' }}
                >
                    <Settings size={16} />
                    View Site
                </Link>
                <button
                    type="button"
                    onClick={onSignOut}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'none', border: 'none', color: '#9898b0', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898b0' }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
