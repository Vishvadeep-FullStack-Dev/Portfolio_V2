-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Profile
create table if not exists profile (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'Vishvadeep',
  tagline     text not null default 'Full-Stack Engineer & Creative Developer',
  bio         text not null default '',
  email       text not null default '',
  location    text not null default '',
  avatar_url  text,
  resume_url  text,
  available   boolean not null default true,
  social      jsonb not null default '{}',
  theme       jsonb not null default '{}',
  meta        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Projects
create table if not exists projects (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  description  text not null default '',
  cover_url    text,
  demo_url     text,
  repo_url     text,
  tags         text[] not null default '{}',
  tech_stack   text[] not null default '{}',
  featured     boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_tags_gin on projects using gin(tags);
create index if not exists projects_sort_order on projects(sort_order);

-- Skills
create table if not exists skills (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  category   text not null default 'General',
  level      int not null default 80 check (level between 0 and 100),
  icon       text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists skills_category on skills(category);

-- Experience
create table if not exists experience (
  id           uuid primary key default uuid_generate_v4(),
  company      text not null,
  role         text not null,
  location     text not null default '',
  start_date   date not null,
  end_date     date,
  current      boolean not null default false,
  description  text not null default '',
  highlights   text[] not null default '{}',
  logo_url     text,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists experience_sort_order on experience(sort_order);

-- Certifications
create table if not exists certifications (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  issuer       text not null,
  issue_date   date not null,
  expiry_date  date,
  credential_id text,
  credential_url text,
  badge_url    text,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- Contact messages
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at on contact_messages(created_at desc);

-- Page views
create table if not exists page_views (
  id         uuid primary key default uuid_generate_v4(),
  path       text not null default '/',
  referrer   text,
  ua         text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at on page_views(created_at desc);
create index if not exists page_views_path on page_views(path);

-- RLS
alter table profile             enable row level security;
alter table projects            enable row level security;
alter table skills              enable row level security;
alter table experience          enable row level security;
alter table certifications      enable row level security;
alter table contact_messages    enable row level security;
alter table page_views          enable row level security;

-- Public read policies
create policy "public_read_profile"          on profile          for select to anon, authenticated using (true);
create policy "public_read_projects"         on projects         for select to anon, authenticated using (true);
create policy "public_read_skills"           on skills           for select to anon, authenticated using (true);
create policy "public_read_experience"       on experience       for select to anon, authenticated using (true);
create policy "public_read_certifications"   on certifications   for select to anon, authenticated using (true);

-- Anon insert
create policy "anon_insert_contact"    on contact_messages for insert to anon, authenticated with check (true);
create policy "anon_insert_pageviews"  on page_views       for insert to anon, authenticated with check (true);

-- Authenticated CRUD
create policy "auth_all_profile"          on profile          for all to authenticated using (true) with check (true);
create policy "auth_all_projects"         on projects         for all to authenticated using (true) with check (true);
create policy "auth_all_skills"           on skills           for all to authenticated using (true) with check (true);
create policy "auth_all_experience"       on experience       for all to authenticated using (true) with check (true);
create policy "auth_all_certifications"   on certifications   for all to authenticated using (true) with check (true);
create policy "auth_all_contact"          on contact_messages for all to authenticated using (true) with check (true);
create policy "auth_read_pageviews"       on page_views       for select to authenticated using (true);

-- updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profile_updated_at    before update on profile    for each row execute function set_updated_at();
create trigger projects_updated_at   before update on projects   for each row execute function set_updated_at();
create trigger experience_updated_at before update on experience for each row execute function set_updated_at();
