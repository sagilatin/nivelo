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
  lang       text not null default 'es' check (lang in ('es','fr','de','it','ja','en')),
  level      text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  headline   text not null,
  summary    text,
  body       jsonb not null,
  primary key (article_id, lang, level)
);

create table if not exists summary_translations (
  article_id text references articles(id) on delete cascade,
  lang       text not null default 'es' check (lang in ('es','fr','de','it','ja','en')),
  target_lang text not null check (target_lang in ('en','he','de','fr','it','ja')),
  text       text not null,
  primary key (article_id, lang, target_lang)
);

create table if not exists word_translations (
  word        text not null,
  source_lang text not null default 'es' check (source_lang in ('es','fr','de','it','ja','en')),
  lang        text not null check (lang in ('en','he','de','fr','it','ja')),
  translation text not null,
  provider   text default 'deepl',     -- 'deepl' | 'gemini' | 'glossary' | 'identity'
  cached_at  timestamptz default now(),
  primary key (word, source_lang, lang)
);

create table if not exists quizzes (
  article_id text references articles(id) on delete cascade,
  lang       text not null default 'es' check (lang in ('es','fr','de','it','ja','en')),
  level      text not null default 'B1',
  questions  jsonb not null,
  primary key (article_id, lang, level)
);

create table if not exists pipeline_status (
  id                 int primary key default 1,
  lang               text not null default 'es' check (lang in ('es','fr','de','it','ja','en')),
  last_run_at        timestamptz,
  articles_fetched   int,
  articles_processed int,
  errors             jsonb,
  check (id = 1)
);

-- ─── Existing-install migrations ───────────────────────────────────
-- Older Nivelo installs were Spanish-only. These blocks preserve existing
-- rows as `lang = 'es'` and widen keys so each article can carry multiple
-- practice-language content packs.

alter table article_translations add column if not exists lang text;
update article_translations set lang = 'es' where lang is null;
alter table article_translations alter column lang set default 'es';
alter table article_translations alter column lang set not null;
alter table article_translations drop constraint if exists article_translations_lang_check;
alter table article_translations
  add constraint article_translations_lang_check
  check (lang in ('es','fr','de','it','ja','en'));
alter table article_translations drop constraint if exists article_translations_pkey;
alter table article_translations
  add constraint article_translations_pkey
  primary key (article_id, lang, level);

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'summary_translations'
      and column_name = 'target_lang'
  ) then
    alter table summary_translations add column target_lang text;
    update summary_translations set target_lang = lang, lang = 'es';
  end if;
end $$;
alter table summary_translations drop constraint if exists summary_translations_pkey;
update summary_translations set target_lang = lang where target_lang is null;
update summary_translations set lang = 'es' where lang is null;
alter table summary_translations alter column lang set default 'es';
alter table summary_translations alter column lang set not null;
alter table summary_translations alter column target_lang set not null;
alter table summary_translations drop constraint if exists summary_translations_lang_check;
alter table summary_translations
  add constraint summary_translations_lang_check
  check (lang in ('es','fr','de','it','ja','en'));
alter table summary_translations drop constraint if exists summary_translations_target_lang_check;
alter table summary_translations
  add constraint summary_translations_target_lang_check
  check (target_lang in ('en','he','de','fr','it','ja'));
alter table summary_translations
  add constraint summary_translations_pkey
  primary key (article_id, lang, target_lang);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'spanish'
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'word'
  ) then
    update word_translations set word = spanish where word is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'spanish'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'word'
  ) then
    alter table word_translations rename column spanish to word;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'source'
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'provider'
  ) then
    update word_translations set provider = source where provider is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'source'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'word_translations'
      and column_name = 'provider'
  ) then
    alter table word_translations rename column source to provider;
  end if;
end $$;
alter table word_translations add column if not exists word text;
alter table word_translations add column if not exists source_lang text;
alter table word_translations add column if not exists provider text;
update word_translations set source_lang = 'es' where source_lang is null;
update word_translations set provider = 'deepl' where provider is null;
alter table word_translations alter column source_lang set default 'es';
alter table word_translations alter column provider set default 'deepl';
alter table word_translations alter column word set not null;
alter table word_translations alter column source_lang set not null;
alter table word_translations alter column lang set not null;
alter table word_translations drop constraint if exists word_translations_source_lang_check;
alter table word_translations
  add constraint word_translations_source_lang_check
  check (source_lang in ('es','fr','de','it','ja','en'));
alter table word_translations drop constraint if exists word_translations_lang_check;
alter table word_translations
  add constraint word_translations_lang_check
  check (lang in ('en','he','de','fr','it','ja'));
alter table word_translations drop constraint if exists word_translations_pkey;
alter table word_translations
  add constraint word_translations_pkey
  primary key (word, source_lang, lang);

alter table quizzes add column if not exists lang text;
update quizzes set lang = 'es' where lang is null;
alter table quizzes alter column lang set default 'es';
alter table quizzes alter column lang set not null;
alter table quizzes drop constraint if exists quizzes_lang_check;
alter table quizzes
  add constraint quizzes_lang_check
  check (lang in ('es','fr','de','it','ja','en'));
alter table quizzes drop constraint if exists quizzes_pkey;
alter table quizzes
  add constraint quizzes_pkey
  primary key (article_id, lang, level);

alter table pipeline_status add column if not exists lang text;
update pipeline_status set lang = 'es' where lang is null;
alter table pipeline_status alter column lang set default 'es';
alter table pipeline_status alter column lang set not null;
alter table pipeline_status drop constraint if exists pipeline_status_lang_check;
alter table pipeline_status
  add constraint pipeline_status_lang_check
  check (lang in ('es','fr','de','it','ja','en'));
alter table pipeline_status drop constraint if exists pipeline_status_pkey;
alter table pipeline_status
  add constraint pipeline_status_pkey
  primary key (id, lang);
insert into pipeline_status (id, lang) values (1, 'es') on conflict (id, lang) do nothing;

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
create index if not exists article_translations_lang_level_idx on article_translations (lang, level);
create index if not exists summary_translations_article_lang_idx on summary_translations (article_id, lang);
create index if not exists quizzes_article_lang_idx on quizzes (article_id, lang);
