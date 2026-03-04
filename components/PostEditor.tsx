'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold, Italic, Code, List, ListOrdered, Quote, Minus, Link as LinkIcon,
    Image as ImageIcon, Heading1, Heading2, Heading3, Save, Eye, EyeOff,
    ArrowLeft, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

type Category = { id: string; name: string; slug: string }

type Props = {
    initialPost?: any
    isEdit?: boolean
}

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function estimateReadTime(text: string) {
    const words = text.trim().split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
}

export default function PostEditor({ initialPost, isEdit = false }: Props) {
    const router = useRouter()
    const [title, setTitle] = useState(initialPost?.title || '')
    const [slug, setSlug] = useState(initialPost?.slug || '')
    const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '')
    const [coverImage, setCoverImage] = useState(initialPost?.cover_image || '')
    const [categoryId, setCategoryId] = useState(initialPost?.category_id || '')
    const [tags, setTags] = useState<string[]>(initialPost?.tags || [])
    const [tagInput, setTagInput] = useState('')
    const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft')
    const [categories, setCategories] = useState<Category[]>([])
    const [saving, setSaving] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: initialPost?.content || '',
        editorProps: {
            attributes: {
                'data-placeholder': 'Start writing your article here...',
            },
        },
    })

    useEffect(() => {
        fetch('/api/posts?status=all').then(r => r.json())
        // Fetch categories
        fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => { })
    }, [])

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEdit && title) setSlug(slugify(title))
    }, [title, isEdit])

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const tag = tagInput.trim().toLowerCase()
            if (tag && !tags.includes(tag)) setTags([...tags, tag])
            setTagInput('')
        }
    }

    const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

    const handleSave = useCallback(async (publish?: boolean) => {
        if (!title.trim()) { toast.error('Title is required'); return }
        setSaving(true)
        const content = editor?.getHTML() || ''
        const readingTime = estimateReadTime(editor?.getText() || '')

        const body = {
            title: title.trim(),
            slug: slug.trim() || slugify(title),
            excerpt: excerpt.trim(),
            content,
            cover_image: coverImage.trim() || null,
            category_id: categoryId || null,
            tags,
            status: publish !== undefined ? (publish ? 'published' : 'draft') : status,
            reading_time: readingTime,
        }

        try {
            const url = isEdit ? `/api/posts/${initialPost.id}` : '/api/posts'
            const method = isEdit ? 'PUT' : 'POST'
            const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const d = await r.json()
            if (d.error) throw new Error(d.error)
            toast.success(isEdit ? 'Post updated!' : 'Post created!')
            if (!isEdit) router.push(`/admin/posts/${d.post.id}/edit`)
            else if (publish !== undefined) setStatus(publish ? 'published' : 'draft')
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setSaving(false)
        }
    }, [title, slug, excerpt, coverImage, categoryId, tags, status, editor, isEdit, initialPost, router])

    const toolbarBtn = (action: () => void, icon: React.ReactNode, title: string, active?: boolean) => (
        <button
            type="button"
            title={title}
            onClick={action}
            style={{
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.15s',
                background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
                borderColor: active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)',
                color: active ? '#a78bfa' : '#9898b0',
            }}
        >
            {icon}
        </button>
    )

    return (
        <div style={{ padding: '32px', maxWidth: '1100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => router.back()} className="btn-icon" style={{ width: '36px', height: '36px' }}>
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            {isEdit ? 'Edit Post' : 'New Post'}
                        </h1>
                        <p style={{ color: '#9898b0', fontSize: '13px' }}>
                            Status: <span style={{ color: status === 'published' ? '#34d399' : '#fbbf24', fontWeight: 600 }}>{status}</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSave(false)} className="btn-secondary" disabled={saving}>
                        <Save size={14} /> Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(status !== 'published')}
                        className="btn-primary"
                        disabled={saving}
                    >
                        {status === 'published' ? <><EyeOff size={14} /> Unpublish</> : <><Sparkles size={14} /> Publish</>}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
                {/* Main editor */}
                <div>
                    {/* Title */}
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Article title..."
                        style={{
                            width: '100%',
                            fontSize: '2rem', fontWeight: 800,
                            background: 'transparent', border: 'none', outline: 'none',
                            color: '#f0f0f8', marginBottom: '16px',
                            fontFamily: 'var(--font-sans)',
                        }}
                    />

                    {/* Excerpt */}
                    <textarea
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                        placeholder="Short description (shown in article cards)..."
                        rows={2}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                            padding: '12px',
                            color: '#9898b0',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: '20px',
                            fontFamily: 'var(--font-sans)',
                        }}
                    />

                    {/* Editor toolbar */}
                    <div
                        style={{
                            display: 'flex', gap: '4px', flexWrap: 'wrap',
                            padding: '10px 12px',
                            background: '#16161e',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px 10px 0 0',
                            borderBottom: 'none',
                        }}
                    >
                        {toolbarBtn(() => editor?.chain().focus().toggleBold().run(), <Bold size={14} />, 'Bold', editor?.isActive('bold'))}
                        {toolbarBtn(() => editor?.chain().focus().toggleItalic().run(), <Italic size={14} />, 'Italic', editor?.isActive('italic'))}
                        {toolbarBtn(() => editor?.chain().focus().toggleCode().run(), <Code size={14} />, 'Code', editor?.isActive('code'))}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
                        {toolbarBtn(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={14} />, 'H1', editor?.isActive('heading', { level: 1 }))}
                        {toolbarBtn(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={14} />, 'H2', editor?.isActive('heading', { level: 2 }))}
                        {toolbarBtn(() => editor?.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={14} />, 'H3', editor?.isActive('heading', { level: 3 }))}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
                        {toolbarBtn(() => editor?.chain().focus().toggleBulletList().run(), <List size={14} />, 'Bullet List', editor?.isActive('bulletList'))}
                        {toolbarBtn(() => editor?.chain().focus().toggleOrderedList().run(), <ListOrdered size={14} />, 'Ordered List', editor?.isActive('orderedList'))}
                        {toolbarBtn(() => editor?.chain().focus().toggleBlockquote().run(), <Quote size={14} />, 'Blockquote', editor?.isActive('blockquote'))}
                        {toolbarBtn(() => editor?.chain().focus().setHorizontalRule().run(), <Minus size={14} />, 'Divider')}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
                        {toolbarBtn(() => {
                            const url = prompt('Enter URL:')
                            if (url) editor?.chain().focus().setLink({ href: url }).run()
                        }, <LinkIcon size={14} />, 'Add Link')}
                        {toolbarBtn(() => {
                            const url = prompt('Enter image URL:')
                            if (url) editor?.chain().focus().setImage({ src: url }).run()
                        }, <ImageIcon size={14} />, 'Add Image')}
                    </div>

                    {/* Editor area */}
                    <div
                        style={{
                            minHeight: '500px',
                            padding: '24px',
                            background: '#16161e',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '0 0 10px 10px',
                            cursor: 'text',
                        }}
                        onClick={() => editor?.commands.focus()}
                    >
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Slug */}
                    <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                        <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            URL Slug
                        </label>
                        <input
                            className="input-field"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            placeholder="article-url-slug"
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Category */}
                    <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                        <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Category
                        </label>
                        <select
                            className="input-field"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            style={{ fontSize: '13px' }}
                        >
                            <option value="">Select category...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                        <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Tags
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    onClick={() => removeTag(tag)}
                                    style={{
                                        padding: '3px 10px',
                                        background: 'rgba(124,58,237,0.12)',
                                        border: '1px solid rgba(124,58,237,0.25)',
                                        borderRadius: '6px',
                                        color: '#a78bfa',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                    }}
                                    title="Click to remove"
                                >
                                    {tag} ×
                                </span>
                            ))}
                        </div>
                        <input
                            className="input-field"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="Type tag, press Enter"
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Cover image */}
                    <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                        <label style={{ display: 'block', color: '#9898b0', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Cover Image URL
                        </label>
                        <input
                            className="input-field"
                            value={coverImage}
                            onChange={e => setCoverImage(e.target.value)}
                            placeholder="https://..."
                            style={{ fontSize: '13px' }}
                        />
                        {coverImage && (
                            <img src={coverImage} alt="cover preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
