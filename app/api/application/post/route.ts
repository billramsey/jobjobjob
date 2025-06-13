import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { companyName, salaryMin, salaryMax, title, officePolicy, listingUrl } =
    await request.json();

  const { error: insertError } = await supabase.from('jobs').insert({
    company: companyName,
    salary_min_dollars: salaryMin,
    salary_max_dollars: salaryMax,
    job_title: title,
    office_policy: officePolicy,
    listing_url: listingUrl,
  });

  if (insertError) {
    console.log('insertError', insertError);
  }
  return Response.json({ success: true });
}
