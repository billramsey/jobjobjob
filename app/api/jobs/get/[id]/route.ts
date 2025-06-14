import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
  if (error) {
    console.log(`error getting single job ${error}`);
  }
  return Response.json(job);
}
