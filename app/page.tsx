import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Rss, BookOpen, Users, Brain, Cpu, LineChart, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'
import VisitorTracker from '@/components/VisitorTracker'

export const metadata: Metadata = {
  title: 'Debananda Kanhar | AI, ML & Data Science',
}

async function getFeaturedPosts() {
  try {
    const { data } = await supabase
      .from('posts')
      .select('*, categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

const categories = [
  { name: 'AI & ML', slug: 'ai-ml', icon: Brain, color: '#7c3aed', badge: 'badge-purple', desc: 'Deep dives into AI and ML algorithms' },
  { name: 'AI Agents', slug: 'agents', icon: Cpu, color: '#3b82f6', badge: 'badge-blue', desc: 'Building autonomous AI agents' },
  { name: 'Use Cases', slug: 'use-cases', icon: Zap, color: '#10b981', badge: 'badge-green', desc: 'Real-world AI applications' },
  { name: 'Teaching', slug: 'teaching', icon: BookOpen, color: '#f59e0b', badge: 'badge-amber', desc: 'Data & Computer Science education' },
  { name: 'Personal Life', slug: 'personal-life', icon: Users, color: '#ec4899', badge: 'badge-pink', desc: 'Family, friends & reflections' },
  { name: 'Technology', slug: 'technology', icon: LineChart, color: '#06b6d4', badge: 'badge-cyan', desc: 'Trends and opinions in tech' },
]

export default async function HomePage() {
  const posts = await getFeaturedPosts()

  return (
    <>
      <VisitorTracker />

      {/* ================================ HERO ================================ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: '780px' }}>
            {/* Tag line */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '100px',
                marginBottom: '28px',
                fontSize: '13px',
                color: '#a78bfa',
                fontWeight: 500,
              }}
              className="animate-fade-in"
            >
              <Brain size={14} />
              AI Researcher · Data Scientist · Educator
            </div>

            {/* Name */}
            <h1
              style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px' }}
              className="animate-fade-in-up"
            >
              <span style={{ display: 'block', color: '#f0f0f8' }}>Debananda</span>
              <span className="hero-gradient-text" style={{ display: 'block' }}>Kanhar</span>
            </h1>

            {/* Bio */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#9898b0',
                lineHeight: 1.7,
                marginBottom: '36px',
                maxWidth: '600px',
              }}
              className="animate-fade-in-up delay-100"
            >
              I write about <span style={{ color: '#a78bfa', fontWeight: 600 }}>Artificial Intelligence</span>,{' '}
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>Machine Learning</span>, and the future of technology.
              I also teach Data Science & Computer Science, and occasionally share stories from family life.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} className="animate-fade-in-up delay-200">
              <Link href="/articles" className="btn-primary">
                <Rss size={16} /> Read Articles
              </Link>
              <Link href="/teaching" className="btn-secondary">
                <BookOpen size={16} /> Teaching Hub
              </Link>
            </div>
          </div>

          {/* Floating stat badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '60px',
              flexWrap: 'wrap',
            }}
            className="animate-fade-in-up delay-300"
          >
            {[
              { label: 'Articles Published', value: posts.length.toString().padStart(2, '0') },
              { label: 'Topics Covered', value: '6+' },
              { label: 'Teaching Modules', value: '10+' },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: '16px 24px',
                  background: 'rgba(16,16,22,0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  minWidth: '150px',
                }}
              >
                <div className="stat-number">{value}</div>
                <div style={{ color: '#9898b0', fontSize: '12px', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ CATEGORIES ================================ */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            Explore Topics
          </h2>
          <p style={{ color: '#9898b0' }}>Find articles by subject area</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map(({ name, slug, icon: Icon, color, desc }) => (
            <Link
              key={slug}
              href={`/articles?cat=${slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="glass-card" style={{ padding: '24px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    color: color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f0f8', marginBottom: '6px' }}>{name}</h3>
                <p style={{ color: '#9898b0', fontSize: '13px', lineHeight: 1.5 }}>{desc}</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '14px',
                    color: color,
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  View articles <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================ RECENT POSTS ================================ */}
      {posts.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Recent Articles</h2>
              <p style={{ color: '#9898b0' }}>Latest thoughts and tutorials</p>
            </div>
            <Link href="/articles" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="articles-grid">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post as any} />
            ))}
          </div>
        </section>
      )}

      {/* ================================ EMPTY STATE ================================ */}
      {posts.length === 0 && (
        <section
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Rss size={32} color="#a78bfa" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
            Articles coming soon!
          </h2>
          <p style={{ color: '#9898b0', lineHeight: 1.6, marginBottom: '24px' }}>
            Connect your Supabase database and start publishing from the{' '}
            <Link href="/admin" style={{ color: '#a78bfa' }}>Admin Panel</Link>.
          </p>
        </section>
      )}
    </>
  )
}
