import Lookup from '@/lib/server/lookup';

export async function POST(request: Request) {
  const { url } = await request.json();
  const lookupData = await Lookup.fetch(url);
  return Response.json(lookupData);
}
