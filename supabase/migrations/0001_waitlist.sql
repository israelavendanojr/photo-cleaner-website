create table public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique
    check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
grant select, insert on public.waitlist to service_role;
