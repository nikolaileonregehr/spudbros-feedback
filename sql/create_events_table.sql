create table events (
  id uuid default gen_random_uuid() primary key,
  event text not null,
  location_id text,
  properties jsonb,
  user_agent text,
  referrer text,
  created_at timestamptz default now()
);

alter table events enable row level security;

create policy "Allow anonymous inserts" on events
  for insert to anon with check (true);
