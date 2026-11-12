"use server";

import { nestApiUrl, parseRouteId } from "../../utils/route-input";

export async function startRouteAction(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const routeId = parseRouteId(formData.get("route_id"));
  if (!routeId) return { error: "Selecione uma rota válida." };

  let url: URL;
  try {
    url = nestApiUrl(process.env.NEST_API_URL, `/routes/${encodeURIComponent(routeId)}/start`);
  } catch {
    return { error: "Serviço de rotas não configurado." };
  }

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      // Nunca tratar 4xx/5xx como comando executado, nem registrar body upstream.
      return { error: "Não foi possível iniciar a rota." };
    }
    return { success: true };
  } catch {
    return { error: "Serviço de rotas indisponível." };
  }
}
