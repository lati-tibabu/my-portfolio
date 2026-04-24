export const dynamic = "force-dynamic";

const namespace = "lati-tibabu-my-portfolio";
const key = "visitors";

async function readCounter() {
  const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch visitor counter");
  }

  return response.json() as Promise<{ value?: number }>;
}

export async function GET() {
  try {
    const data = await readCounter();
    return Response.json({ count: data.value ?? 0 });
  } catch {
    return Response.json({ count: 0 }, { status: 200 });
  }
}