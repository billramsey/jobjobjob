## Job Application Tracker

Will lookup information about the job listing like salary range, title, etc. if you give the job listing url

Store the job application.  Allow you to track through process.



# Current Feature set:
not much.
will query ashbyhq job listings and get title, salary range.

## TODO

Add job from listing url.
filter on different stages of the process.
add more listing types.
make ui pretty.

## Taken from nextjs supabase template

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

#### command list:

bunx supabase migration new create_jobs_table