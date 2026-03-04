-- =============================================
-- Personal Website - Supabase Schema
-- Run this in your Supabase SQL editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- Categories
-- =============================================
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- Seed default categories
insert into categories (name, slug, description, color) values
  ('AI & ML', 'ai-ml', 'Artificial Intelligence and Machine Learning articles', '#8b5cf6'),
  ('Agents', 'agents', 'AI Agents, AutoGen, LangChain and more', '#3b82f6'),
  ('Use Cases', 'use-cases', 'Real-world AI/ML use cases and applications', '#10b981'),
  ('Teaching', 'teaching', 'Data Science and Computer Science teaching content', '#f59e0b'),
  ('Personal Life', 'personal-life', 'Family, friends and personal experiences', '#ec4899'),
  ('Technology', 'technology', 'General technology articles and opinions', '#06b6d4')
on conflict do nothing;

-- =============================================
-- Posts
-- =============================================
create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  reading_time integer default 5,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_posts_updated_at
  before update on posts
  for each row execute function update_updated_at_column();

-- =============================================
-- Page Views (Analytics)
-- =============================================
create table if not exists page_views (
  id uuid default uuid_generate_v4() primary key,
  page_path text not null,
  visitor_hash text,   -- hashed IP for privacy
  country text,
  city text,
  device_type text,    -- 'desktop', 'mobile', 'tablet'
  browser text,
  referrer text,
  created_at timestamptz default now()
);

-- Index for fast analytics queries
create index if not exists idx_page_views_path on page_views(page_path);
create index if not exists idx_page_views_created_at on page_views(created_at);

-- =============================================
-- Visitor Sessions
-- =============================================
create table if not exists visitors (
  id uuid default uuid_generate_v4() primary key,
  visitor_hash text not null unique,
  first_visit timestamptz default now(),
  last_visit timestamptz default now(),
  visit_count integer default 1
);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Posts: anyone can read published posts
alter table posts enable row level security;
create policy "Published posts are viewable by everyone"
  on posts for select
  using (status = 'published');

create policy "Admin can do everything on posts"
  on posts for all
  using (auth.role() = 'service_role');

-- Categories: anyone can read
alter table categories enable row level security;
create policy "Categories are viewable by everyone"
  on categories for select using (true);
create policy "Admin can manage categories"
  on categories for all using (auth.role() = 'service_role');

-- Page views: insert allowed for tracking, read only for admin
alter table page_views enable row level security;
create policy "Anyone can insert page views"
  on page_views for insert with check (true);
create policy "Admin can read page views"
  on page_views for select using (auth.role() = 'service_role');

alter table visitors enable row level security;
create policy "Anyone can upsert visitors"
  on visitors for all with check (true);
create policy "Admin can read visitors"
  on visitors for select using (auth.role() = 'service_role');
