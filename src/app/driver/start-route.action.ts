"use server";

import { parseRouteId } from "../../utils/route-input";
import { demoRoutesEnabled, nestRoutesConfig } from "../../utils/server-routes";

export async function startRouteAction(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  if (!demoRoutesEnabled()) return { error: "Operação indisponível sem autenticação." };
  const routeId = parseRouteId(formData.get("route_id"));
  if (!routeId) return { error: "Selecione uma rota válida." };

  let config: ReturnType<typeof nestRoutesConfig>;
  try {
    config = nestRoutesConfig(`/routes/${encodeURIComponent(routeId)}/start`);
  } catch {
    return { error: "Serviço de rotas não configurado." };
  }

  try {
    const response = await fetch(config.url.toString(), {
      method: "POST",
      headers: config.headers,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { error: "Não foi possível iniciar a rota." };
    return { success: true };
  } catch {
    return { error: "Serviço de rotas indisponível." };
  }
}
