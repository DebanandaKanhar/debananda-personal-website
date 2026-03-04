import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

function getDeviceType(ua: string): string {
    if (/mobile/i.test(ua)) return 'mobile'
    if (/tablet|ipad/i.test(ua)) return 'tablet'
    return 'desktop'
}

function getBrowser(ua: string): string {
    if (/chrome/i.test(ua) && !/edge/i.test(ua)) return 'Chrome'
    if (/firefox/i.test(ua)) return 'Firefox'
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
    if (/edge/i.test(ua)) return 'Edge'
    return 'Other'
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { path, referrer, userAgent = '' } = body

        // Get visitor IP and hash it for privacy
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            '0.0.0.0'
        const visitorHash = crypto.createHash('sha256').update(ip + (process.env.NEXTAUTH_SECRET || '')).digest('hex').slice(0, 16)

        const deviceType = getDeviceType(userAgent)
        const browser = getBrowser(userAgent)

        // Record page view
        await supabaseAdmin.from('page_views').insert([
            {
                page_path: path,
                visitor_hash: visitorHash,
                device_type: deviceType,
                browser,
                referrer: referrer || null,
            },
        ])

        // Upsert visitor record
        const { data: existingVisitor } = await supabaseAdmin
            .from('visitors')
            .select('id, visit_count')
            .eq('visitor_hash', visitorHash)
            .single()

        if (existingVisitor) {
            await supabaseAdmin
                .from('visitors')
                .update({ last_visit: new Date().toISOString(), visit_count: existingVisitor.visit_count + 1 })
                .eq('visitor_hash', visitorHash)
        } else {
            await supabaseAdmin.from('visitors').insert([{ visitor_hash: visitorHash, visit_count: 1 }])
        }

        // Increment post view count if this is an article page
        const articleMatch = path.match(/^\/articles\/(.+)$/)
        if (articleMatch) {
            const slug = articleMatch[1]
            try {
                await supabaseAdmin.rpc('increment_view_count', { post_slug: slug })
            } catch {/* ignore if function not created yet */ }
        }

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false })
    }
}
