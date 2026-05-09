-- Run this once in Supabase → SQL editor → New query → paste → Run.
-- Idempotent: safe to re-run.

-- ─── Tables ─────────────────────────────────────────────────────────

create table if not exists articles (
  id              text primary key,
  country         text not null,
  source          text not null,
  source_lang     text not null,
  source_url      text not null,
  category        text default 'NOTICIAS',
  pub_date        timestamptz,
  raw_title       text,
  raw_description text,
  image_seed      text,
  fetched_at      timestamptz default now()
);

create table if not exists article_translations (
  article_id text references articles(id) on delete cascade,
  level      text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  headline   text not null,
  summary    text,
  body       jsonb not null,
  primary key (article_id, level)
);

create table if not exists summary_translations (
  article_id text references articles(id) on delete cascade,
  lang       text not null,            -- 'en','he','de','fr','it','ja'
  text       text not null,
  primary key (article_id, lang)
);

create table if not exists word_translations (
  spanish    text not null,
  lang       text not null,
  translation text not null,
  source     text default 'deepl',     -- 'deepl' | 'gemini' | 'glossary'
  cached_at  timestamptz default now(),
  primary key (spanish, lang)
);

create table if not exists quizzes (
  article_id text primary key references articles(id) on delete cascade,
  level      text not null default 'B1',
  questions  jsonb not null
);

create table if not exists pipeline_status (
  id                 int primary key default 1,
  last_run_at        timestamptz,
  articles_fetched   int,
  articles_processed int,
  errors             jsonb,
  check (id = 1)
);

insert into pipeline_status (id) values (1) on conflict (id) do nothing;

-- ─── Row level security ─────────────────────────────────────────────
-- Anonymous users can READ everything. Writes are done by the cron / api
-- functions using the service_role key, which bypasses RLS entirely.

alter table articles                 enable row level security;
alter table article_translations     enable row level security;
alter table summary_translations     enable row level security;
alter table word_translations        enable row level security;
alter table quizzes                  enable row level security;
alter table pipeline_status          enable row level security;

drop policy if exists "anon read articles"             on articles;
drop policy if exists "anon read article_translations" on article_translations;
drop policy if exists "anon read summary_translations" on summary_translations;
drop policy if exists "anon read word_translations"    on word_translations;
drop policy if exists "anon read quizzes"              on quizzes;
drop policy if exists "anon read pipeline_status"      on pipeline_status;

create policy "anon read articles"             on articles                 for select using (true);
create policy "anon read article_translations" on article_translations     for select using (true);
create policy "anon read summary_translations" on summary_translations     for select using (true);
create policy "anon read word_translations"    on word_translations        for select using (true);
create policy "anon read quizzes"              on quizzes                  for select using (true);
create policy "anon read pipeline_status"      on pipeline_status          for select using (true);

-- ─── Helpful indexes ────────────────────────────────────────────────
create index if not exists articles_country_pub_date_idx on articles (country, pub_date desc);
create index if not exists summary_translations_article_idx on summary_translations (article_id);
