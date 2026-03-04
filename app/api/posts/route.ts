import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const cat = searchParams.get('cat')
    const q = searchParams.get('q')
    const status = searchParams.get('status') // admin use
    const authHeader = req.headers.get('x-admin-token')

    // Only admin can see drafts
    const isAdmin = authHeader === process.env.NEXTAUTH_SECRET
    const filterStatus = isAdmin && status ? status : 'published'

    try {
        let query = supabaseAdmin
            .from('posts')
            .select('*, categories(*)')
            .order('published_at', { ascending: false })

        if (!isAdmin || !status) {
            query = query.eq('status', 'published')
        } else if (status !== 'all') {
            query = query.eq('status', status)
        }

        if (cat) {
            // Join with categories to filter by slug
            const { data: catData } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('slug', cat)
                .single()
            if (catData) query = query.eq('category_id', catData.id)
        }

        if (q) {
            query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,tags.cs.{${q}}`)
        }

        const { data, error } = await query
        if (error) {
            // Return empty for DB not configured
            return NextResponse.json({ posts: [], error: error.message })
        }
        return NextResponse.json({ posts: data || [] })
    } catch {
        return NextResponse.json({ posts: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert([{
                ...body,
                published_at: body.status === 'published' ? new Date().toISOString() : null,
            }])
            .select('*, categories(*)')
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ post: data }, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
