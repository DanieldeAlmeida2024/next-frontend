import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isMoveForRoute, validGps } from "../src/utils/route-socket-data.ts";

test("NEXT-WS-01: GPS rejeita coordenadas não finitas e fora dos limites", () => {
  for (const point of [{ lat: Infinity, lng: 0 }, { lat: NaN, lng: 0 },
    { lat: 91, lng: 0 }, { lat: 0, lng: -181 }, null, "x"]) {
    assert.equal(validGps(point), false);
  }
  assert.equal(validGps({ lat: -16.68, lng: -49.26 }), true);
});
test("NEXT-WS-02: rota A não aceita eventos de GPS da rota B", () => {
  assert.equal(isMoveForRoute({ route_id: "B", lat: 0, lng: 0 }, "A"), false);
  assert.equal(isMoveForRoute({ route_id: "A", lat: 0, lng: 0 }, "A"), true);
});
test("NEXT-WS-03: admin é protegido no servidor e troca de rota limpa listener", () => {
  const admin = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
  const driver = readFileSync(new URL("../src/app/driver/MapDriver.tsx", import.meta.url), "utf8");
  assert.match(admin, /if \(!demoRoutesEnabled\(\)\)/);
  assert.match(admin, /AdminMapClient/);
  assert.match(driver, /socket\.off\(eventName, movedHandler\)/);
  assert.doesNotMatch(driver, /offAny\(/);
  assert.doesNotMatch(driver, /console\.log\(/);
});
