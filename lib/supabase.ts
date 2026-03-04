import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

export type Post = {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    cover_image?: string
    category_id?: string
    tags: string[]
    status: 'draft' | 'published'
    featured: boolean
    reading_time: number
    view_count: number
    created_at: string
    updated_at: string
    published_at?: string
    categories?: Category
}

export type Category = {
    id: string
    name: string
    slug: string
    description?: string
    color: string
    created_at: string
}

export type PageView = {
    id: string
    page_path: string
    visitor_hash?: string
    country?: string
    city?: string
    device_type?: string
    browser?: string
    referrer?: string
    created_at: string
}
