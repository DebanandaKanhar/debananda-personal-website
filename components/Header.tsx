'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Brain, Rss, BookOpen, User, Mail, Shield } from 'lucide-react'

const navLinks = [
    { href: '/articles', label: 'Articles', icon: Rss },
    { href: '/teaching', label: 'Teaching', icon: BookOpen },
    { href: '/about', label: 'About', icon: User },
    { href: '/contact', label: 'Contact', icon: Mail },
]

export default function Header() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Hide header on admin pages (admin has its own layout)
    if (pathname?.startsWith('/admin')) return null

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: 'all 0.3s ease',
                background: scrolled
                    ? 'rgba(10,10,15,0.92)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid transparent',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                    }}
                >
                    <div
                        style={{
                            width: '38px',
                            height: '38px',
                            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Brain size={20} color="white" />
                    </div>
                    <div>
                        <span
                            style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#f0f0f8',
                                display: 'block',
                                lineHeight: 1.2,
                            }}
                        >
                            Debananda
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: '#9898b0',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                            }}
                        >
                            AI & Data Science
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
                    {navLinks.map(({ href, label }) => {
                        const isActive = pathname === href || pathname?.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    color: isActive ? '#a78bfa' : '#9898b0',
                                    background: isActive ? 'rgba(124,58,237,0.1)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#f0f0f8'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#9898b0'
                                        e.currentTarget.style.background = 'transparent'
                                    }
                                }}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <Link href="/admin" className="btn-secondary" style={{ marginLeft: '8px', padding: '8px 16px', fontSize: '13px' }}>
                        <Shield size={14} />
                        Admin
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="btn-icon show-mobile"
                    aria-label="Toggle menu"
                    style={{ display: 'none' }}
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div
                    style={{
                        background: 'rgba(10,10,15,0.98)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        padding: '16px 24px 24px',
                    }}
                >
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                textDecoration: 'none',
                                color: pathname === href ? '#a78bfa' : '#9898b0',
                                fontSize: '15px',
                                fontWeight: 500,
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 0',
                            textDecoration: 'none',
                            color: '#9898b0',
                            fontSize: '15px',
                            fontWeight: 500,
                            marginTop: '4px',
                        }}
                    >
                        <Shield size={16} />
                        Admin Panel
                    </Link>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
        </header>
    )
}
