"use server";

import { revalidateTag } from "next/cache";
import { nestApiUrl, parseDirections, parsePlaceId } from "../../utils/route-input";

export async function createRouteAction(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const sourceId = parsePlaceId(formData.get("sourceId"));
  const destinationId = parsePlaceId(formData.get("destinationId"));
  if (!sourceId || !destinationId || sourceId === destinationId) {
    return { error: "Origem e destino válidos e diferentes são obrigatórios." };
  }

  let directionsUrl: URL;
  let routesUrl: URL;
  try {
    directionsUrl = nestApiUrl(process.env.NEST_API_URL, "/directions");
    routesUrl = nestApiUrl(process.env.NEST_API_URL, "/routes");
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

    const response = await fetch(routesUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
