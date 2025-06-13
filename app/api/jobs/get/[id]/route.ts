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
  console.log(error);
  return Response.json(job);
}
