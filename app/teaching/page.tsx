'use client'

import { BookOpen, Code2, BarChart3, Brain, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const courses = [
    {
        title: 'Data Science Fundamentals',
        icon: BarChart3,
        color: '#f59e0b',
        badge: 'badge-amber',
        level: 'Beginner → Advanced',
        topics: ['Python for Data Science', 'NumPy & Pandas', 'Data Visualization', 'Statistical Analysis', 'Machine Learning Basics'],
        tag: 'data-science',
    },
    {
        title: 'Machine Learning in Depth',
        icon: Brain,
        color: '#7c3aed',
        badge: 'badge-purple',
        level: 'Intermediate → Advanced',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation', 'Deep Learning Intro'],
        tag: 'machine-learning',
    },
    {
        title: 'Computer Science Essentials',
        icon: Code2,
        color: '#3b82f6',
        badge: 'badge-blue',
        level: 'Beginner → Intermediate',
        topics: ['Algorithms & Data Structures', 'Object Oriented Programming', 'System Design Basics', 'Databases', 'Web Development'],
        tag: 'computer-science',
    },
    {
        title: 'AI Agents & Automation',
        icon: BookOpen,
        color: '#10b981',
        badge: 'badge-green',
        level: 'Intermediate',
        topics: ['LLM Fundamentals', 'LangChain & AutoGen', 'RAG Systems', 'Tool Use & Planning', 'Production Deployment'],
        tag: 'agents',
    },
]

export default function TeachingPage() {
    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 80px' }}>
            {/* Header */}
            <div style={{ marginBottom: '56px', textAlign: 'center' }}>
                <span className="badge badge-amber" style={{ marginBottom: '16px', display: 'inline-flex' }}>
                    <BookOpen size={11} /> Teaching
                </span>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '16px' }}>
                    Learn <span className="gradient-text">Data Science</span> &{' '}
                    <span className="gradient-text">AI</span>
                </h1>
                <p style={{ color: '#9898b0', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
                    Structured courses and articles to guide you from beginner to expert in Data Science, ML, and AI.
                </p>
            </div>

            {/* Courses grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '24px', marginBottom: '80px' }}>
                {courses.map(({ title, icon: Icon, color, badge, level, topics, tag }) => (
                    <div key={title} className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ width: '52px', height: '52px', background: `${color}22`, border: `1px solid ${color}44`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{title}</h2>
                                <span className={`badge ${badge}`}>{level}</span>
                            </div>
                        </div>

                        <ul style={{ padding: '0 0 0 4px', margin: '0 0 20px', listStyle: 'none' }}>
                            {topics.map((topic) => (
                                <li key={topic} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#9898b0', fontSize: '14px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    {topic}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={`/articles?cat=${tag}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: color, fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                                transition: 'gap 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
                            onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
                        >
                            View articles <ArrowRight size={14} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div
                style={{
                    textAlign: 'center',
                    padding: '64px 40px',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08))',
                    border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: '20px',
                }}
            >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>
                    Want personalized guidance?
                </h2>
                <p style={{ color: '#9898b0', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                    Reach out to discuss teaching opportunities, workshops, or learning roadmaps.
                </p>
                <Link href="/contact" className="btn-primary">
                    Get in Touch <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    )
}
