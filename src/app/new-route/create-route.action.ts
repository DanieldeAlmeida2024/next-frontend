"use server";

import { revalidateTag } from "next/cache";
import { nestApiUrl, parseDirections, parsePlaceId } from "../../utils/route-input";
import { demoRoutesEnabled, nestRoutesConfig } from "../../utils/server-routes";

export async function createRouteAction(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  if (!demoRoutesEnabled()) return { error: "Operação indisponível sem autenticação." };
  const sourceId = parsePlaceId(formData.get("sourceId"));
  const destinationId = parsePlaceId(formData.get("destinationId"));
  if (!sourceId || !destinationId || sourceId === destinationId) {
    return { error: "Origem e destino válidos e diferentes são obrigatórios." };
  }

  let directionsUrl: URL;
  let routes: ReturnType<typeof nestRoutesConfig>;
  try {
    directionsUrl = nestApiUrl(process.env.NEST_API_URL, "/directions");
    routes = nestRoutesConfig("/routes");
    directionsUrl.searchParams.set("originId", sourceId);
    directionsUrl.searchParams.set("destinationId", destinationId);
  } catch {
    return { error: "Serviço de rotas não configurado." };
  }

  try {
    const directionsResponse = await fetch(directionsUrl.toString(), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!directionsResponse.ok) return { error: "Não foi possível consultar o trajeto." };

    const directions = parseDirections(await directionsResponse.json());
    if (!directions) return { error: "Serviço de mapas retornou dados incompletos." };

    const response = await fetch(routes.url.toString(), {
      method: "POST",
      headers: { ...routes.headers, "Content-Type": "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        name: `${directions.startAddress} - ${directions.endAddress}`,
        source_id: directions.sourceId,
        destination_id: directions.destinationId,
      }),
    });
    if (!response.ok) return { error: "Não foi possível criar a rota." };
    revalidateTag("routes");
    return { success: true };
  } catch {
    return { error: "Serviço de rotas indisponível." };
  }
}
