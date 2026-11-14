import test from "node:test";
import assert from "node:assert/strict";
import {
  parseRouteId, parsePlaceId, parseSearchTerm, nestApiUrl, parseDirections,
} from "../src/utils/route-input.ts";

test("NEXT-T01: route IDs reject URL injection and non-string data", () => {
  assert.equal(parseRouteId(" 507f1f77bcf86cd799439011 "), "507f1f77bcf86cd799439011");
  assert.equal(parseRouteId("route-a_01"), "route-a_01");
  for (const value of [null, {}, "", "../admin", "one/two", "hello?x=1", "a#b", "a%2Fb", "x".repeat(129)]) {
    assert.equal(parseRouteId(value), null);
  }
});

test("NEXT-T02: place IDs and search inputs are validated before fetch", () => {
  assert.equal(parsePlaceId("place_id:abc_DEF-3"), "abc_DEF-3");
  for (const value of [null, "place_id:", "/route", "a?b", "a b", "x".repeat(257)]) {
    assert.equal(parsePlaceId(value), null);
  }
  assert.equal(parseSearchTerm(" Goiânia "), "Goiânia");
  for (const value of ["", " ".repeat(3), "\n", "a\u0000b", "x".repeat(121)]) {
    assert.equal(parseSearchTerm(value), null);
  }
});

test("NEXT-T03: Nest URL excludes credentials and untrusted paths", () => {
  const endpoint = nestApiUrl("http://nest:3000", "/routes/route-a");
  assert.equal(endpoint.toString(), "http://nest:3000/routes/route-a");
  for (const base of ["", "ftp://nest", "http://user:password@nest", "http://nest/a",
    "http://nest?x=1", "not-a-url"]) {
    assert.throws(() => nestApiUrl(base, "/routes"));
  }
  assert.throws(() => nestApiUrl("http://nest:3000", "//attacker.invalid"));
});

test("NEXT-T04: Directions require valid addresses and place IDs", () => {
  const good = {
    routes: [{ legs: [{
      start_address: "Rua A", end_address: "Rua B",
    }] }],
    request: {
      origin: { place_id: "place_id:abc" },
      destination: { place_id: "place_id:def" },
    },
  };
  assert.deepEqual(parseDirections(good), {
    startAddress: "Rua A", endAddress: "Rua B", sourceId: "abc", destinationId: "def",
  });
  assert.equal(parseDirections({ routes: [] }), null);
  assert.equal(parseDirections({ ...good, request: null }), null);
  assert.equal(parseDirections({ ...good, routes: [{ legs: [{ start_address: "", end_address: "B" }] }] }), null);
  assert.equal(parseDirections({ ...good, request: { origin: { place_id: "/" } } }), null);
});
