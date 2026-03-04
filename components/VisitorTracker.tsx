'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Fire-and-forget page view tracking
        fetch('/api/analytics/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
            }),
        }).catch(() => { }) // Silently fail if DB not configured
    }, [pathname])

    return null
}
