'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import ArticleCard from '@/components/ArticleCard'
import type { Post } from '@/lib/supabase'
import { Suspense } from 'react'

const CATEGORIES = [
    { name: 'All', slug: '' },
    { name: 'AI & ML', slug: 'ai-ml' },
    { name: 'Agents', slug: 'agents' },
    { name: 'Use Cases', slug: 'use-cases' },
    { name: 'Teaching', slug: 'teaching' },
    { name: 'Personal Life', slug: 'personal-life' },
    { name: 'Technology', slug: 'technology' },
]

function ArticlesContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || '')

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (activeCategory) params.set('cat', activeCategory)
            if (search) params.set('q', search)
            const res = await fetch(`/api/posts?${params.toString()}`)
            const data = await res.json()
            setPosts(data.posts || [])
        } catch {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }, [activeCategory, search])

    useEffect(() => {
        const tid = setTimeout(fetchPosts, search ? 400 : 0)
        return () => clearTimeout(tid)
    }, [fetchPosts, search])

    const onCategoryClick = (slug: string) => {
        setActiveCategory(slug)
        const params = new URLSearchParams(searchParams.toString())
        if (slug) params.set('cat', slug)
        else params.delete('cat')
        router.replace(`/articles?${params.toString()}`)
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 80px' }}>
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '12px' }}>
                    <span className="gradient-text">Articles</span>
                </h1>
                <p style={{ color: '#9898b0', fontSize: '18px', maxWidth: '500px' }}>
                    Thoughts, tutorials, and stories on AI, ML, technology, and life.
                </p>
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5c5c70' }} />
                    <input
                        className="input-field"
                        style={{ paddingLeft: '42px' }}
                        type="search"
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9898b0', cursor: 'pointer' }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
                {CATEGORIES.map(({ name, slug }) => (
                    <button
                        key={slug}
                        onClick={() => onCategoryClick(slug)}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '100px',
                            border: '1px solid',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderColor: activeCategory === slug ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                            background: activeCategory === slug ? 'rgba(124,58,237,0.15)' : 'transparent',
                            color: activeCategory === slug ? '#a78bfa' : '#9898b0',
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            {loading ? (
                <div className="articles-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass-card" style={{ padding: '22px' }}>
                            <div className="skeleton" style={{ height: '180px', marginBottom: '16px' }} />
                            <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '10px' }} />
                            <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                            <div className="skeleton" style={{ height: '14px' }} />
                        </div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <>
                    <p style={{ color: '#5c5c70', fontSize: '13px', marginBottom: '20px' }}>
                        {posts.length} article{posts.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="articles-grid">
                        {posts.map((post) => <ArticleCard key={post.id} post={post as any} />)}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Filter size={40} color="#5c5c70" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: '#9898b0', fontWeight: 500 }}>No articles found</h3>
                    <p style={{ color: '#5c5c70', fontSize: '14px' }}>Try a different category or search term.</p>
                </div>
            )}
        </div>
    )
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <ArticlesContent />
        </Suspense>
    )
}
