import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: jobs, error } = await supabase.from('jobs').select('*').order('id');
  if (error) {
    console.log(`error getting all jobs ${error}`);
  }
  return Response.json(jobs);
}
