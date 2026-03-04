'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Twitter, Brain, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
    const pathname = usePathname()
    const [visitorCount, setVisitorCount] = useState<number | null>(null)

    useEffect(() => {
        fetch('/api/analytics/stats?type=total-visitors')
            .then((r) => r.json())
            .then((d) => setVisitorCount(d.total || 0))
            .catch(() => { })
    }, [])

    if (pathname?.startsWith('/admin')) return null

    return (
        <footer
            style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '48px 24px 32px',
                marginTop: '80px',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '40px',
                        marginBottom: '40px',
                    }}
                >
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Brain size={16} color="white" />
                            </div>
                            <span style={{ fontWeight: 700, color: '#f0f0f8', fontSize: '15px' }}>Debananda Kanhar</span>
                        </div>
                        <p style={{ color: '#9898b0', fontSize: '13px', lineHeight: 1.6, maxWidth: '240px' }}>
                            Writing about AI, ML, Agents, and the intersection of technology and life.
                        </p>
                        {visitorCount !== null && (
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginTop: '12px',
                                    padding: '6px 12px',
                                    background: 'rgba(124,58,237,0.1)',
                                    border: '1px solid rgba(124,58,237,0.2)',
                                    borderRadius: '100px',
                                    fontSize: '12px',
                                    color: '#a78bfa',
                                    fontWeight: 600,
                                }}
                            >
                                <Eye size={12} />
                                {visitorCount.toLocaleString()} total visitors
                            </div>
                        )}
                    </div>

                    {/* Writing */}
                    <div>
                        <h4 style={{ color: '#f0f0f8', fontSize: '13px', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Writing
                        </h4>
                        {[
                            { href: '/articles?cat=ai-ml', label: 'AI & Machine Learning' },
                            { href: '/articles?cat=agents', label: 'AI Agents' },
                            { href: '/articles?cat=use-cases', label: 'Use Cases' },
                            { href: '/articles?cat=personal-life', label: 'Personal Life' },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    display: 'block',
                                    color: '#9898b0',
                                    fontSize: '13px',
                                    textDecoration: 'none',
                                    marginBottom: '8px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#9898b0')}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Teaching */}
                    <div>
                        <h4 style={{ color: '#f0f0f8', fontSize: '13px', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Teaching
                        </h4>
                        {[
                            { href: '/teaching', label: 'Data Science' },
                            { href: '/teaching', label: 'Computer Science' },
                            { href: '/teaching', label: 'Machine Learning' },
                            { href: '/articles?cat=teaching', label: 'All Courses' },
                        ].map(({ href, label }) => (
                            <Link
                                key={label}
                                href={href}
                                style={{
                                    display: 'block',
                                    color: '#9898b0',
                                    fontSize: '13px',
                                    textDecoration: 'none',
                                    marginBottom: '8px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#9898b0')}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 style={{ color: '#f0f0f8', fontSize: '13px', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Connect
                        </h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { href: 'https://github.com/debanandakanhar', icon: Github, label: 'GitHub' },
                                { href: 'https://linkedin.com/in/debanandakanhar', icon: Linkedin, label: 'LinkedIn' },
                                { href: 'https://twitter.com/debanandakanhar', icon: Twitter, label: 'Twitter' },
                            ].map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '8px',
                                        color: '#9898b0',
                                        transition: 'all 0.2s',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                                        e.currentTarget.style.color = '#a78bfa'
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                        e.currentTarget.style.color = '#9898b0'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                                    }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                    }}
                >
                    <span style={{ color: '#5c5c70', fontSize: '13px' }}>
                        © {new Date().getFullYear()} Debananda Kanhar. All rights reserved.
                    </span>
                    <span style={{ color: '#5c5c70', fontSize: '13px' }}>
                        Built with Next.js & Supabase
                    </span>
                </div>
            </div>
        </footer>
    )
}
