import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin.from('categories').select('*').order('name')
        if (error) return NextResponse.json({ categories: [] })
        return NextResponse.json({ categories: data || [] })
    } catch {
        return NextResponse.json({ categories: [] })
    }
}
