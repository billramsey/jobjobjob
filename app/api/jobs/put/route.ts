import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request) {
  const supabase = await createClient();

  const json = await request.json();
  const {
    id,
    company,
    listing_url,
    job_title,
    salary_min_dollars,
    salary_max_dollars,
    office_policy,
  } = json;

  console.log('ID', json);

  const { error: insertError } = await supabase
    .from('jobs')
    .update({
      company: company,
      salary_min_dollars: salary_min_dollars,
      salary_max_dollars: salary_max_dollars,
      job_title: job_title,
      office_policy: office_policy,
      listing_url: listing_url,
    })
    .eq('id', id);

  if (insertError) {
    console.log('insertError', insertError);
  }
  return Response.json({ success: true });
}
