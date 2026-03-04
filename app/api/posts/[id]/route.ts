import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, categories(*)')
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ post: data })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const body = await req.json()
        const updates: any = { ...body }

        // Set published_at when first publishing
        if (body.status === 'published') {
            const { data: existing } = await supabaseAdmin
                .from('posts')
                .select('published_at, status')
                .eq('id', id)
                .single()

            if (existing && existing.status !== 'published') {
                updates.published_at = new Date().toISOString()
            }
        }

        const { data, error } = await supabaseAdmin
            .from('posts')
            .update(updates)
            .eq('id', id)
            .select('*, categories(*)')
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ post: data })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { error } = await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
}
