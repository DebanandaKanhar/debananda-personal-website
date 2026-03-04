'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter !== 'all') params.set('status', filter)
            else params.set('status', 'all')
            const r = await fetch(`/api/posts?${params.toString()}`, {
                headers: { 'x-admin-token': '' }, // passes through for admin
            })
            const d = await r.json()
            setPosts(d.posts || [])
        } catch {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPosts() }, [filter])

    const deletePost = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
        try {
            await fetch(`/api/posts/${id}`, { method: 'DELETE' })
            toast.success('Post deleted')
            fetchPosts()
        } catch {
            toast.error('Failed to delete post')
        }
    }

    const togglePublish = async (post: any) => {
        const newStatus = post.status === 'published' ? 'draft' : 'published'
        try {
            await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}`)
            fetchPosts()
        } catch {
            toast.error('Failed to update post')
        }
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>All Posts</h1>
                    <p style={{ color: '#9898b0', fontSize: '14px' }}>{posts.length} posts found</p>
                </div>
                <Link href="/admin/posts/new" className="btn-primary">
                    <PlusCircle size={15} /> New Post
                </Link>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['all', 'published', 'draft'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '7px 16px',
                            borderRadius: '8px', border: '1px solid',
                            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: filter === f ? 'rgba(124,58,237,0.15)' : 'transparent',
                            borderColor: filter === f ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                            color: filter === f ? '#a78bfa' : '#9898b0',
                            textTransform: 'capitalize',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#9898b0' }}>Loading...</div>
                ) : posts.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: '#9898b0', marginBottom: '16px' }}>No posts found.</p>
                        <Link href="/admin/posts/new" className="btn-primary">Create your first post</Link>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map((h) => (
                                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#5c5c70', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, i) => (
                                <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                    <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                                        <span style={{ color: '#f0f0f8', fontSize: '14px', fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {post.title}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#9898b0', fontSize: '13px' }}>
                                        {post.categories?.name || '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                                            background: post.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                            color: post.status === 'published' ? '#34d399' : '#fbbf24',
                                            border: `1px solid ${post.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                        }}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#9898b0', fontSize: '13px' }}>
                                        {post.view_count?.toLocaleString() || 0}
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#9898b0', fontSize: '13px' }}>
                                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link href={`/admin/posts/${post.id}/edit`} className="btn-icon" style={{ width: '32px', height: '32px' }} title="Edit">
                                                <Edit size={14} />
                                            </Link>
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className="btn-icon"
                                                style={{ width: '32px', height: '32px' }}
                                                title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                                            >
                                                {post.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id, post.title)}
                                                className="btn-icon"
                                                style={{ width: '32px', height: '32px', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
