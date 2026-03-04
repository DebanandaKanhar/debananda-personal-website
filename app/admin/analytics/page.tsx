'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, Eye, TrendingUp, FileText, Monitor, Smartphone, Tablet } from 'lucide-react'

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']

export default function AdminAnalyticsPage() {
    const [overview, setOverview] = useState<any>(null)
    const [dailyViews, setDailyViews] = useState<any[]>([])
    const [topPages, setTopPages] = useState<any[]>([])
    const [devices, setDevices] = useState<any[]>([])
    const [browsers, setBrowsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const base = '/api/analytics/stats?type='
        Promise.all([
            fetch(`${base}overview`).then(r => r.json()),
            fetch(`${base}daily-views&days=30`).then(r => r.json()),
            fetch(`${base}top-pages`).then(r => r.json()),
            fetch(`${base}devices`).then(r => r.json()),
            fetch(`${base}browsers`).then(r => r.json()),
        ]).then(([ov, dv, tp, dev, br]) => {
            setOverview(ov)
            setDailyViews(dv.data || [])
            setTopPages(tp.data || [])
            setDevices(dev.data || [])
            setBrowsers(br.data || [])
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statCards = overview ? [
        { label: 'Total Visitors', value: overview.totalVisitors, icon: Users, color: '#10b981' },
        { label: "Today's Views", value: overview.todayViews, icon: Eye, color: '#3b82f6' },
        { label: 'Last 7 Days', value: overview.weekViews, icon: TrendingUp, color: '#7c3aed' },
        { label: 'Last 30 Days', value: overview.monthViews, icon: BarChart, color: '#f59e0b' },
        { label: 'Total Posts', value: overview.totalPosts, icon: FileText, color: '#ec4899' },
    ] : []

    const deviceIcon = (name: string) => {
        if (name === 'mobile') return <Smartphone size={14} />
        if (name === 'tablet') return <Tablet size={14} />
        return <Monitor size={14} />
    }

    const tooltipStyle = {
        contentStyle: { background: '#16161e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0f0f8', fontSize: '12px' },
        labelStyle: { color: '#9898b0' },
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Analytics</h1>
                <p style={{ color: '#9898b0', fontSize: '14px' }}>Visitor statistics and site performance</p>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                        {statCards.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} style={{ padding: '20px', background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                                <div style={{ width: '36px', height: '36px', background: `${color}22`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color }}>
                                    <Icon size={16} />
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0f0f8', lineHeight: 1 }}>
                                    {typeof value === 'number' ? value.toLocaleString() : '—'}
                                </div>
                                <div style={{ color: '#9898b0', fontSize: '12px', marginTop: '4px' }}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Daily views chart */}
                    {dailyViews.length > 0 && (
                        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Daily Page Views (Last 30 Days)
                            </h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={dailyViews}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fill: '#5c5c70', fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                                    <YAxis tick={{ fill: '#5c5c70', fontSize: 11 }} />
                                    <Tooltip {...tooltipStyle} />
                                    <Line type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
                        {/* Top Pages */}
                        {topPages.length > 0 && (
                            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', gridColumn: '1 / span 2' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top Pages</h2>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={topPages} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis type="number" tick={{ fill: '#5c5c70', fontSize: 11 }} />
                                        <YAxis type="category" dataKey="page" tick={{ fill: '#5c5c70', fontSize: 10 }} width={120} />
                                        <Tooltip {...tooltipStyle} />
                                        <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Devices */}
                        {devices.length > 0 && (
                            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Devices</h2>
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={(props: any) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                                            {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip {...tooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                                    {devices.map((d, i) => (
                                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                            <span style={{ color: '#9898b0', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {deviceIcon(d.name)} {d.name}
                                            </span>
                                            <span style={{ color: '#f0f0f8', fontWeight: 600, marginLeft: 'auto' }}>{d.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Browsers */}
                        {browsers.length > 0 && (
                            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', gridColumn: '1 / span 3' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browser Distribution</h2>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={browsers}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" tick={{ fill: '#5c5c70', fontSize: 11 }} />
                                        <YAxis tick={{ fill: '#5c5c70', fontSize: 11 }} />
                                        <Tooltip {...tooltipStyle} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {browsers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* No data state */}
                    {!dailyViews.length && !topPages.length && (
                        <div style={{ textAlign: 'center', padding: '80px', color: '#9898b0' }}>
                            <TrendingUp size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <h3 style={{ fontWeight: 500, marginBottom: '8px' }}>No analytics data yet</h3>
                            <p style={{ fontSize: '14px', color: '#5c5c70' }}>Connect Supabase and visit a few pages to start collecting data.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
