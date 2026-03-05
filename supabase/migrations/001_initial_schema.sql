-- LedgerLaw.ai — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

-- Profiles (linked to Clerk user_id)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text not null,
  full_name text,
  role text not null check (role in ('Partner', 'Sr. Associate', 'Associate', 'Paralegal', 'Case Manager', 'Legal Assistant', 'Admin')),
  status text default 'Active' check (status in ('Active', 'Invited')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Carriers (insurance companies)
create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  claim_software text,
  adherence text,
  notes text,
  created_at timestamptz default now()
);

-- Cases
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  case_id text unique not null,
  client_name text not null,
  case_type text not null,
  status text not null check (status in ('Draft', 'Review', 'Sent', 'In Negotiation', 'Settled')),
  accident_date date,
  demand_amount text,
  medicals_amount text,
  policy_limit text,
  carrier_id uuid references public.carriers(id),
  attorney_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Demands (generated demand letters)
create table if not exists public.demands (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  pages int,
  icd_codes int,
  exhibits int,
  file_url text,
  created_at timestamptz default now()
);

-- Documents (uploaded files)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  name text not null,
  page_count int,
  tags text[],
  relevance text,
  file_url text,
  created_at timestamptz default now()
);

-- Verdicts (comparable cases)
create table if not exists public.verdicts (
  id uuid primary key default gen_random_uuid(),
  case_name text,
  year int,
  venue text,
  case_type text,
  injuries text,
  award_amount text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.carriers enable row level security;
alter table public.cases enable row level security;
alter table public.demands enable row level security;
alter table public.documents enable row level security;
alter table public.verdicts enable row level security;

-- Policies (permissive for dev; tighten with Clerk JWT integration)
create policy "Profiles readable by anon"
  on public.profiles for select to anon using (true);

create policy "Carriers readable by anon"
  on public.carriers for select to anon using (true);

create policy "Cases readable by anon"
  on public.cases for select to anon using (true);

create policy "Demands readable by anon"
  on public.demands for select to anon using (true);

create policy "Documents readable by anon"
  on public.documents for select to anon using (true);

create policy "Verdicts readable by anon"
  on public.verdicts for select to anon using (true);

-- Seed carriers
insert into public.carriers (name, claim_software, adherence, notes) values
  ('Allstate', 'Colossus', 'Very High', 'Most wedded to Colossus. Will litigate rather than exceed range.'),
  ('State Farm', 'ClaimIQ', 'Medium', 'Proprietary system. More negotiable.'),
  ('GEICO', 'Internal AI', 'High', 'Proprietary. Aggressive on soft tissue.'),
  ('Progressive', 'Colossus', 'Medium', 'Adjusters have more latitude.'),
  ('Farmers', 'Colossus', 'High', 'Similar approach to Allstate.'),
  ('Travelers', 'Colossus', 'Low', 'Most negotiable Colossus user.'),
  ('USAA', 'Colossus', 'Medium', 'Generally fairer.'),
  ('Hartford', 'Colossus', 'Medium', 'Standard implementation.'),
  ('Liberty Mutual', 'Colossus', 'Med-High', 'Significant reliance.'),
  ('Nationwide', 'Colossus', 'Medium', 'Adjusters retain discretion.'),
  ('MetLife', 'Colossus', 'Medium', 'Licensed user.'),
  ('Erie', 'Colossus', 'Low-Med', 'Less rigid.')
on conflict (name) do nothing;
