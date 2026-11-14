import { NextRequest, NextResponse } from "next/server";
import { parseRouteId } from "../../../../utils/route-input";
import { demoRoutesEnabled, nestRoutesConfig } from "../../../../utils/server-routes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  if (!demoRoutesEnabled()) {
    return NextResponse.json({ error: "Consulta sem autenticação desabilitada." }, { status: 403 });
  }
  const routeId = parseRouteId((await params).routeId);
  if (!routeId) {
    return NextResponse.json({ error: "ID de rota inválido." }, { status: 400 });
  }

  let config: ReturnType<typeof nestRoutesConfig>;
  try {
    config = nestRoutesConfig(`/routes/${encodeURIComponent(routeId)}`);
  } catch {
    return NextResponse.json({ error: "Serviço de rotas não configurado." }, { status: 503 });
  }

  try {
    const response = await fetch(config.url.toString(), {
      headers: config.headers,
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
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "Resposta inválida da API." }, { status: 502 });
    }
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "API de rotas inacessível." }, { status: 502 });
  }
}
