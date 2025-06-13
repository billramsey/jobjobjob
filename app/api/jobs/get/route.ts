import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: jobs, error } = await supabase.from('jobs').select('*');
  if (error) {
    console.log(error);
  }
  return Response.json(jobs);
}
