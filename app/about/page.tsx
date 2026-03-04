'use client'

import { Github, Linkedin, Twitter, Mail, MapPin, Briefcase, Heart } from 'lucide-react'

const timeline = [
    { year: '2024–Present', role: 'Senior Data Scientist', org: 'Current Organization', desc: 'Leading AI/ML initiatives, building predictive systems for large-scale operations.' },
    { year: '2021–2024', role: 'Data Scientist', org: 'Previous Organization', desc: 'Developed machine learning models and analytics pipelines for railway systems.' },
    { year: '2018–2021', role: 'Software Engineer', org: 'Earlier Role', desc: 'Full-stack development and early exploration of data science.' },
    { year: '2014–2018', role: 'B.Tech in Computer Science', org: 'University', desc: 'Foundation in algorithms, systems programming, and mathematics.' },
]

const skills = [
    { name: 'Python', level: 95 },
    { name: 'Machine Learning', level: 92 },
    { name: 'Deep Learning', level: 85 },
    { name: 'PySpark / Big Data', level: 88 },
    { name: 'AI Agents (LangChain, AutoGen)', level: 80 },
    { name: 'Data Visualization', level: 87 },
]

export default function AboutPage() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
            {/* Hero */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'center', marginBottom: '64px', flexWrap: 'wrap' }}>
                <div
                    style={{
                        width: '140px', height: '140px',
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4)',
                        borderRadius: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '60px',
                        flexShrink: 0,
                    }}
                >
                    👨‍💻
                </div>
                <div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '8px' }}>
                        Debananda Kanhar
                    </h1>
                    <p style={{ color: '#a78bfa', fontWeight: 600, marginBottom: '12px', fontSize: '15px' }}>
                        AI Researcher · Data Scientist · Educator
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#9898b0', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={13} /> India
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Briefcase size={13} /> Senior Data Scientist
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        {[
                            { href: 'https://github.com/debanandakanhar', icon: Github },
                            { href: 'https://linkedin.com/in/debanandakanhar', icon: Linkedin },
                            { href: 'https://twitter.com/debanandakanhar', icon: Twitter },
                            { href: 'mailto:debananda@example.com', icon: Mail },
                        ].map(({ href, icon: Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '38px', height: '38px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', color: '#9898b0',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#9898b0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>About Me</h2>
                <p style={{ color: '#9898b0', lineHeight: 1.8, fontSize: '15px', marginBottom: '14px' }}>
                    I&apos;m a Data Scientist and AI researcher with a passion for building intelligent systems that
                    solve real-world problems. My work spans the entire ML lifecycle — from raw data ingestion and
                    feature engineering to model training, deployment, and MLOps.
                </p>
                <p style={{ color: '#9898b0', lineHeight: 1.8, fontSize: '15px', marginBottom: '14px' }}>
                    I specialize in <strong style={{ color: '#f0f0f8' }}>predictive maintenance</strong>,{' '}
                    <strong style={{ color: '#f0f0f8' }}>AI agents</strong>, and large-scale data pipelines using
                    PySpark, Kafka, and modern ML frameworks. I love teaching — breaking down complex topics into
                    clear, actionable concepts.
                </p>
                <p style={{ color: '#9898b0', lineHeight: 1.8, fontSize: '15px' }}>
                    Outside work, I cherish time with{' '}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={13} color="#ec4899" /> family and friends
                    </span>
                    , enjoy cooking, and occasionally share thoughts about life's interesting intersections with technology.
                </p>
            </div>

            {/* Skills */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Skills & Expertise</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {skills.map(({ name, level }) => (
                        <div key={name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#f0f0f8' }}>{name}</span>
                                <span style={{ fontSize: '13px', color: '#9898b0' }}>{level}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${level}%`,
                                        background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
                                        borderRadius: '3px',
                                        transition: 'width 1s ease',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Career Timeline</h2>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #7c3aed, transparent)' }} />
                    {timeline.map(({ year, role, org, desc }, i) => (
                        <div key={i} style={{ display: 'flex', gap: '24px', paddingBottom: '28px', position: 'relative' }}>
                            <div
                                style={{
                                    width: '16px', height: '16px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                                    flexShrink: 0, marginTop: '4px', zIndex: 1,
                                }}
                            />
                            <div>
                                <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{year}</span>
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f0f8', margin: '4px 0 2px' }}>{role}</h3>
                                <p style={{ fontSize: '13px', color: '#7c3aed', marginBottom: '6px' }}>{org}</p>
                                <p style={{ color: '#9898b0', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
