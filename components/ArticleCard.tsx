'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, Tag, ArrowRight } from 'lucide-react'
import type { Post } from '@/lib/supabase'

type Props = {
    post: Post & { categories?: { name: string; slug: string; color: string } }
    featured?: boolean
}

export default function ArticleCard({ post, featured = false }: Props) {
    const categoryColors: Record<string, string> = {
        'ai-ml': 'badge-purple',
        'agents': 'badge-blue',
        'use-cases': 'badge-green',
        'teaching': 'badge-amber',
        'personal-life': 'badge-pink',
        'technology': 'badge-cyan',
    }

    const catSlug = post.categories?.slug || ''
    const badgeClass = categoryColors[catSlug] || 'badge-purple'

    return (
        <article className="glass-card" style={{ overflow: 'hidden', position: 'relative' }}>
            {/* Cover image */}
            {post.cover_image && (
                <div style={{ position: 'relative', height: featured ? '240px' : '180px', overflow: 'hidden' }}>
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.9) 100%)',
                        }}
                    />
                </div>
            )}

            <div style={{ padding: featured ? '28px' : '22px' }}>
                {/* Category + reading time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {post.categories && (
                        <span className={`badge ${badgeClass}`}>{post.categories.name}</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5c5c70', fontSize: '12px' }}>
                        <Clock size={11} />
                        <span>{post.reading_time} min read</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5c5c70', fontSize: '12px' }}>
                        <Eye size={11} />
                        <span>{post.view_count.toLocaleString()}</span>
                    </div>
                </div>

                {/* Title */}
                <h3
                    style={{
                        fontSize: featured ? '1.35rem' : '1.1rem',
                        fontWeight: 700,
                        color: '#f0f0f8',
                        marginBottom: '10px',
                        lineHeight: 1.3,
                    }}
                >
                    {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                    <p
                        style={{
                            color: '#9898b0',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            marginBottom: '16px',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {post.excerpt}
                    </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    color: '#9898b0',
                                    fontSize: '11px',
                                    background: 'rgba(255,255,255,0.04)',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                <Tag size={9} />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: date + link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#5c5c70', fontSize: '12px' }}>
                        {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                            : 'Draft'}
                    </span>
                    <Link
                        href={`/articles/${post.slug}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#a78bfa',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'gap 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.gap = '8px')}
                        onMouseLeave={(e) => (e.currentTarget.style.gap = '4px')}
                    >
                        Read more <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </article>
    )
}
