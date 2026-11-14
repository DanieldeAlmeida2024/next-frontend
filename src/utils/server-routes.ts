/** Server-side connection settings. Do not import from Client Components. */
import { nestApiUrl } from "./route-input.ts";

export function demoRoutesEnabled(): boolean {
  return process.env.ALLOW_UNAUTHENTICATED_ROUTE_DEMO === "true";
}

export function nestRoutesConfig(path: string): { url: URL; headers: Record<string, string> } {
  const apiKey = process.env.ROUTES_API_KEY;
  if (typeof apiKey !== "string" || apiKey.length < 32) {
    throw new Error("ROUTES_API_KEY não configurada no servidor Next.js");
  }
  return {
    url: nestApiUrl(process.env.NEST_API_URL, path),
    headers: { "x-routes-api-key": apiKey },
  };
}
