import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { FileText, Eye, Users, PlusCircle, BarChart2, TrendingUp } from 'lucide-react'

async function getDashboardStats() {
    try {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

        const [published, drafts, visitors, todayViews] = await Promise.all([
            supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
            supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
            supabaseAdmin.from('visitors').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
        ])

        return {
            published: published.count || 0,
            drafts: drafts.count || 0,
            visitors: visitors.count || 0,
            todayViews: todayViews.count || 0,
        }
    } catch {
        return { published: 0, drafts: 0, visitors: 0, todayViews: 0 }
    }
}

async function getRecentPosts() {
    try {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('id, title, status, created_at, view_count, categories(name, color)')
            .order('created_at', { ascending: false })
            .limit(8)
        return data || []
    } catch {
        return []
    }
}

export default async function AdminDashboard() {
    const [stats, posts] = await Promise.all([getDashboardStats(), getRecentPosts()])

    const statCards = [
        { label: 'Published Posts', value: stats.published, icon: FileText, color: '#7c3aed' },
        { label: 'Drafts', value: stats.drafts, icon: FileText, color: '#f59e0b' },
        { label: 'Total Visitors', value: stats.visitors, icon: Users, color: '#10b981' },
        { label: "Today's Views", value: stats.todayViews, icon: Eye, color: '#3b82f6' },
    ]

    return (
        <div style={{ padding: '40px' }}>
            {/* Header */}
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Dashboard</h1>
                <p style={{ color: '#9898b0', fontSize: '14px' }}>
                    Welcome back! Here's an overview of your site.
                </p>
            </div>

            {/* Stat Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '40px',
                }}
            >
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        style={{
                            padding: '24px',
                            background: '#16161e',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px', height: '40px',
                                background: `${color}22`,
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '14px',
                                color: color,
                            }}
                        >
                            <Icon size={18} />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f0f0f8', lineHeight: 1 }}>
                            {value.toLocaleString()}
                        </div>
                        <div style={{ color: '#9898b0', fontSize: '13px', marginTop: '4px' }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <Link href="/admin/posts/new" className="btn-primary">
                    <PlusCircle size={15} /> New Post
                </Link>
                <Link href="/admin/analytics" className="btn-secondary">
                    <BarChart2 size={15} /> View Analytics
                </Link>
                <Link href="/admin/posts" className="btn-secondary">
                    <FileText size={15} /> Manage Posts
                </Link>
            </div>

            {/* Recent Posts Table */}
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} color="#a78bfa" /> Recent Posts
                </h2>
                <div
                    style={{
                        background: '#16161e',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    {posts.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#9898b0' }}>
                            No posts yet. <Link href="/admin/posts/new" style={{ color: '#a78bfa' }}>Create your first post</Link>
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
                                {posts.map((post: any, i) => (
                                    <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                        <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                                            <span
                                                style={{
                                                    color: '#f0f0f8',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {post.title}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ color: '#9898b0', fontSize: '13px' }}>
                                                {(post as any).categories?.name || '—'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span
                                                style={{
                                                    padding: '3px 10px',
                                                    borderRadius: '100px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    background: post.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                                    color: post.status === 'published' ? '#34d399' : '#fbbf24',
                                                    border: `1px solid ${post.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                                }}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#9898b0', fontSize: '13px' }}>
                                            {post.view_count.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#9898b0', fontSize: '13px' }}>
                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                style={{
                                                    color: '#a78bfa',
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
