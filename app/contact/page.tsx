'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // In a real setup, this would call an API endpoint to send email via Resend/Nodemailer
        await new Promise((r) => setTimeout(r, 1000))
        setSent(true)
        toast.success('Message sent! I\'ll get back to you soon.')
        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '12px' }}>
                    Get in <span className="gradient-text">Touch</span>
                </h1>
                <p style={{ color: '#9898b0', fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto' }}>
                    Have a question, project idea, or just want to say hi? I&apos;d love to hear from you.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form */}
                <div className="glass-card" style={{ padding: '36px' }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px' }} />
                            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
                            <p style={{ color: '#9898b0', fontSize: '14px' }}>Thank you for reaching out. I&apos;ll reply within 24–48 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</label>
                                    <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                                    <input className="input-field" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject</label>
                                <input className="input-field" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" required />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</label>
                                <textarea
                                    className="input-field"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell me more..."
                                    rows={5}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                {loading ? 'Sending...' : <><Send size={14} /> Send Message</>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                                <Mail size={18} />
                            </div>
                            <div>
                                <p style={{ color: '#5c5c70', fontSize: '12px', marginBottom: '2px' }}>Email</p>
                                <a href="mailto:debananda@example.com" style={{ color: '#f0f0f8', fontSize: '14px', textDecoration: 'none' }}>debananda@example.com</a>
                            </div>
                        </div>
                    </div>

                    {[
                        { icon: Github, label: 'GitHub', handle: '@debanandakanhar', href: 'https://github.com/debanandakanhar' },
                        { icon: Linkedin, label: 'LinkedIn', handle: 'Debananda Kanhar', href: 'https://linkedin.com/in/debanandakanhar' },
                        { icon: Twitter, label: 'Twitter', handle: '@debanandakanhar', href: 'https://twitter.com/debanandakanhar' },
                    ].map(({ icon: Icon, label, handle, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card"
                            style={{ padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}
                        >
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9898b0' }}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <p style={{ color: '#5c5c70', fontSize: '12px', marginBottom: '2px' }}>{label}</p>
                                <p style={{ color: '#f0f0f8', fontSize: '14px', fontWeight: 500 }}>{handle}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
