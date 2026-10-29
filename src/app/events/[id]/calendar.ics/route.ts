import { content } from "@/lib/content";
import { buildIcs } from "@/lib/ics";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return content.events.map((e) => ({ id: e.id }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const event = content.events.find((e) => e.id === id);
  if (!event) return new Response("Not found", { status: 404 });
  return new Response(buildIcs(event), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${id}.ics"` },
  });
}
