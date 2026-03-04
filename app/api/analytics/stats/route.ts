import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'overview'

    try {
        if (type === 'total-visitors') {
            const { count } = await supabaseAdmin.from('visitors').select('*', { count: 'exact', head: true })
            return NextResponse.json({ total: count || 0 })
        }

        if (type === 'overview') {
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

            const [totalVisitors, todayViews, weekViews, monthViews, posts] = await Promise.all([
                supabaseAdmin.from('visitors').select('*', { count: 'exact', head: true }),
                supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
                supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
                supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo),
                supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }),
            ])

            return NextResponse.json({
                totalVisitors: totalVisitors.count || 0,
                todayViews: todayViews.count || 0,
                weekViews: weekViews.count || 0,
                monthViews: monthViews.count || 0,
                totalPosts: posts.count || 0,
            })
        }

        if (type === 'daily-views') {
            const days = parseInt(searchParams.get('days') || '30')
            const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
            const { data } = await supabaseAdmin
                .from('page_views')
                .select('created_at')
                .gte('created_at', start)
                .order('created_at', { ascending: true })

            // Group by date
            const grouped: Record<string, number> = {}
                ; (data || []).forEach((row) => {
                    const date = row.created_at.slice(0, 10)
                    grouped[date] = (grouped[date] || 0) + 1
                })

            const result = Object.entries(grouped).map(([date, views]) => ({ date, views }))
            return NextResponse.json({ data: result })
        }

        if (type === 'top-pages') {
            const { data } = await supabaseAdmin
                .from('page_views')
                .select('page_path')
                .order('created_at', { ascending: false })
                .limit(1000)

            const counts: Record<string, number> = {}
                ; (data || []).forEach((row) => {
                    counts[row.page_path] = (counts[row.page_path] || 0) + 1
                })

            const sorted = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([page, views]) => ({ page, views }))

            return NextResponse.json({ data: sorted })
        }

        if (type === 'devices') {
            const { data } = await supabaseAdmin.from('page_views').select('device_type')
            const counts: Record<string, number> = {}
                ; (data || []).forEach((row) => {
                    const d = row.device_type || 'unknown'
                    counts[d] = (counts[d] || 0) + 1
                })
            return NextResponse.json({ data: Object.entries(counts).map(([name, value]) => ({ name, value })) })
        }

        if (type === 'browsers') {
            const { data } = await supabaseAdmin.from('page_views').select('browser')
            const counts: Record<string, number> = {}
                ; (data || []).forEach((row) => {
                    const b = row.browser || 'Other'
                    counts[b] = (counts[b] || 0) + 1
                })
            return NextResponse.json({ data: Object.entries(counts).map(([name, value]) => ({ name, value })) })
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
