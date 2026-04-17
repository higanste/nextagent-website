export const runtime = 'edge';
export async function GET() {
  return new Response('Edge Runtime is LIVE', { status: 200 });
}
