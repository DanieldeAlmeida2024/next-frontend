import { NextRequest, NextResponse } from "next/server";
import { nestApiUrl, parseRouteId } from "../../../../utils/route-input";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> }
) {
  const routeId = parseRouteId((await params).routeId);
  if (!routeId) {
    return NextResponse.json({ error: "ID de rota inválido." }, { status: 400 });
  }

  let url: URL;
  try {
    url = nestApiUrl(process.env.NEST_API_URL, `/routes/${encodeURIComponent(routeId)}`);
  } catch {
    return NextResponse.json({ error: "API de rotas indisponível." }, { status: 503 });
  }

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 404) {
      return NextResponse.json({ error: "Rota não encontrada." }, { status: 404 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao consultar rota." }, { status: 502 });
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "Resposta inválida da API." }, { status: 502 });
    }
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "API de rotas inacessível." }, { status: 502 });
  }
}
