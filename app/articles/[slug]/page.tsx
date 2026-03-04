import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { ArrowLeft, Clock, Eye, Tag, Calendar } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const { data: post } = await supabase.from('posts').select('title, excerpt, cover_image').eq('slug', slug).single()
    if (!post) return { title: 'Not Found' }
    return {
        title: post.title,
        description: post.excerpt || undefined,
        openGraph: { title: post.title, description: post.excerpt || undefined, images: post.cover_image ? [post.cover_image] : [] },
    }
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params
    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('*, categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (!post) notFound()

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px' }}>
            {/* Back link */}
            <Link href="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9898b0', textDecoration: 'none', fontSize: '14px', marginBottom: '32px' }}>
                <ArrowLeft size={14} /> Back to Articles
            </Link>

            {/* Category */}
            {(post as any).categories && (
                <Link href={`/articles?cat=${(post as any).categories.slug}`} style={{ textDecoration: 'none' }}>
                    <span className="badge badge-purple" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                        {(post as any).categories.name}
                    </span>
                </Link>
            )}

            {/* Title */}
            <h1
                style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: '20px',
                    color: '#f0f0f8',
                }}
            >
                {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9898b0', fontSize: '13px' }}>
                    <Calendar size={13} />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9898b0', fontSize: '13px' }}>
                    <Clock size={13} />
                    {post.reading_time} min read
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9898b0', fontSize: '13px' }}>
                    <Eye size={13} />
                    {post.view_count.toLocaleString()} views
                </div>
            </div>

            {/* Cover image */}
            {post.cover_image && (
                <img
                    src={post.cover_image}
                    alt={post.title}
                    style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.06)' }}
                />
            )}

            {/* Content */}
            <div
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Tag size={14} color="#5c5c70" />
                    {post.tags.map((tag: string) => (
                        <span key={tag} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#9898b0', fontSize: '13px' }}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
