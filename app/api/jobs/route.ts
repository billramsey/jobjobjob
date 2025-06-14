import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: jobs, error } = await supabase.from('jobs').select('*').order('id');
  if (error) {
    console.log(`error getting all jobs ${error}`);
  }
  return Response.json(jobs);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const json = await request.json();
  const {
    company,
    listing_url,
    job_title,
    salary_min_dollars,
    salary_max_dollars,
    office_policy,
  } = json;

  const { error: insertError } = await supabase.from('jobs').insert({
    company: company,
    salary_min_dollars: salary_min_dollars,
    salary_max_dollars: salary_max_dollars,
    job_title: job_title,
    office_policy: office_policy,
    listing_url: listing_url,
  });

  if (insertError) {
    console.log('insertError', insertError);
  }
  return Response.json({ success: true });
}
