import test from "node:test";
import assert from "node:assert/strict";
import { demoRoutesEnabled, nestRoutesConfig } from "../src/utils/server-routes.ts";

test("NEXT-T05: unauthenticated demo is disabled by default", (t) => {
  t.mock.env("ALLOW_UNAUTHENTICATED_ROUTE_DEMO", "");
  assert.equal(demoRoutesEnabled(), false);
});

test("NEXT-T06: server credential is required and stays in HTTP headers", (t) => {
  t.mock.env("NEST_API_URL", "http://nest:3000");
  t.mock.env("ROUTES_API_KEY", "");
  assert.throws(() => nestRoutesConfig("/routes"), /ROUTES_API_KEY/);
  t.mock.env("ROUTES_API_KEY", "server-only-example-secret-32-chars-long");
  const { url, headers } = nestRoutesConfig("/routes/route-a");
  assert.equal(url.toString(), "http://nest:3000/routes/route-a");
  assert.equal(headers["x-routes-api-key"], process.env.ROUTES_API_KEY);
  assert.ok(!url.toString().includes(headers["x-routes-api-key"]));
});

test("NEXT-T07: opt-in only enables local demonstration by explicit flag", (t) => {
  t.mock.env("ALLOW_UNAUTHENTICATED_ROUTE_DEMO", "TRUE");
  assert.equal(demoRoutesEnabled(), false);
  t.mock.env("ALLOW_UNAUTHENTICATED_ROUTE_DEMO", "true");
  assert.equal(demoRoutesEnabled(), true);
});
