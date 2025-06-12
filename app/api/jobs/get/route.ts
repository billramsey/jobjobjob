import {createClient} from "@/lib/supabase/server";


export async function GET() {
  const supabase = await createClient()
  //const { data, error } = await supabase.auth.getUser()

  const { data: jobs } = await supabase.from('jobs').select('*');
  return Response.json(jobs);
}