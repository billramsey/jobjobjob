create table if not exists jobs (
     id bigint primary key generated always as identity,
     company text not null,
     listing_url text,
     job_title text,
     salary_min_dollars integer,
     salary_max_dollars integer,
     created_at timestamptz default now()
);