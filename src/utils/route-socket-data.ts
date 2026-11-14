/** Verificação estrutural dos eventos recebidos no navegador (não é autorização). */
export type DriverMovedPayload = { route_id: string; lat: number; lng: number };

export function validGps(value: unknown): value is { lat: number; lng: number } {
  if (typeof value !== "object" || value === null) return false;
  const point = value as { lat?: unknown; lng?: unknown };
  return typeof point.lat === "number" && Number.isFinite(point.lat) &&
    point.lat >= -90 && point.lat <= 90 &&
    typeof point.lng === "number" && Number.isFinite(point.lng) &&
    point.lng >= -180 && point.lng <= 180;
}

export function isMoveForRoute(value: unknown, routeId: string): value is DriverMovedPayload {
  if (!validGps(value)) return false;
  const moved = value as { route_id?: unknown };
  return moved.route_id === routeId;
}
