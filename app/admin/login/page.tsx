'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Brain, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError('Invalid email or password. Please try again.')
            setLoading(false)
        } else {
            router.push(callbackUrl)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                        }}
                    >
                        <Brain size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Admin Panel</h1>
                    <p style={{ color: '#9898b0', fontSize: '14px' }}>Sign in to manage your website</p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: '36px' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#9898b0', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                                <Mail size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                Email Address
                            </label>
                            <input
                                className="input-field"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', color: '#9898b0', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                                <Lock size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input-field"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    required
                                    style={{ paddingRight: '44px' }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#9898b0',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 16px',
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.25)',
                                    borderRadius: '10px',
                                    color: '#f87171',
                                    fontSize: '13px',
                                    marginBottom: '20px',
                                }}
                            >
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            {loading ? (
                                <>
                                    <div
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                        }}
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Lock size={14} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#5c5c70', fontSize: '12px', marginTop: '20px' }}>
                    Only authorized administrators can access this panel.
                </p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
