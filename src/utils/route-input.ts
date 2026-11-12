/**
 * Validation boundary between Next.js route forms/handlers and the NestJS API.
 * All helpers are framework-free and tested without external network.
 * This is NOT authorization: NestJS must authenticate the actor independently.
 */
const ROUTE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const PLACE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,255}$/;

export function parseRouteId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return ROUTE_ID.test(id) ? id : null;
}

export function parsePlaceId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  const place = raw.startsWith("place_id:") ? raw.slice("place_id:".length) : raw;
  return PLACE_ID.test(place) ? place : null;
}

export function parseSearchTerm(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const term = value.trim();
  if (term.length === 0 || term.length > 120 || /[\u0000-\u001f\u007f]/.test(term)) {
    return null;
  }
  return term;
}

export function nestApiOrigin(value: string | undefined): string {
  if (!value || !value.trim()) throw new Error("NEST_API_URL não configurada");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEST_API_URL inválida");
  }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEST_API_URL deve conter apenas uma origem HTTP(S) sem credenciais");
  }
  return url.origin;
}

export function nestApiUrl(base: string | undefined, path: string): URL {
  const origin = nestApiOrigin(base);
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Caminho interno inválido");
  }
  return new URL(path, origin);
}

export type RouteDirections = Readonly<{
  startAddress: string;
  endAddress: string;
  sourceId: string;
  destinationId: string;
}>;

/** Extract only fields required to create a route; never trust nested API shape. */
export function parseDirections(value: unknown): RouteDirections | null {
  if (!value || typeof value !== "object") return null;
  const data = value as {
    routes?: { legs?: { start_address?: unknown; end_address?: unknown }[] }[];
    request?: { origin?: { place_id?: unknown }; destination?: { place_id?: unknown } };
  };
  const leg = data.routes?.[0]?.legs?.[0];
  const startAddress = leg?.start_address;
  const endAddress = leg?.end_address;
  const sourceId = parsePlaceId(data.request?.origin?.place_id);
  const destinationId = parsePlaceId(data.request?.destination?.place_id);
  if (typeof startAddress !== "string" || typeof endAddress !== "string" ||
      !startAddress.trim() || !endAddress.trim() ||
      startAddress.length > 300 || endAddress.length > 300 ||
      !sourceId || !destinationId) return null;
  return { startAddress, endAddress, sourceId, destinationId };
}
