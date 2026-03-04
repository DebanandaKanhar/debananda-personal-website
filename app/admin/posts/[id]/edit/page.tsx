import { notFound } from 'next/navigation'
import PostEditor from '@/components/PostEditor'
import { supabaseAdmin } from '@/lib/supabase'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('*, categories(*)')
        .eq('id', id)
        .single()

    if (!post) notFound()

    return <PostEditor initialPost={post} isEdit />
}
