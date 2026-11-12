'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRouteId, parsePlaceId, parseSearchTerm, nestApiOrigin, nestApiUrl,
  parseDirections } = require('../.test-build/utils/route-input.js');

test('RT-01 accepts IDs used as opaque URL path segments', () => {
  for (const id of ['123', 'abc-DEF_123', 'a'.repeat(128)]) {
    assert.equal(parseRouteId(id), id);
  }
});
test('RT-02 rejects traversal, separators, query and unsupported FormData types', () => {
  for (const id of ['', ' ', '../admin', 'a/b', '%2f', '?force=true', 'a#b',
    'a\nb', 'a'.repeat(129), new Blob(['x']), null]) {
    assert.equal(parseRouteId(id), null);
  }
});
test('RT-03 place ID strips exactly one expected upstream prefix', () => {
  assert.equal(parsePlaceId('place_id:ChIJabc_123'), 'ChIJabc_123');
  assert.equal(parsePlaceId('ChIJabc_123'), 'ChIJabc_123');
  for (const bad of [null, '../admin', 'place_id:../admin', 'a&admin=true', '',
    'place_id:place_id:123']) assert.equal(parsePlaceId(bad), null);
});
test('RT-04 search terms accept spaces and accents but deny control chars/oversize', () => {
  assert.equal(parseSearchTerm('  Goiânia Centro  '), 'Goiânia Centro');
  for (const bad of ['', '  ', 'x'.repeat(121), 'a\nb', 'a\0b', 3]) {
    assert.equal(parseSearchTerm(bad), null);
  }
});
test('RT-05 NEST API origin requires scheme, no credentials or path', () => {
  assert.equal(nestApiOrigin('https://api.example.test'), 'https://api.example.test');
  assert.equal(nestApiOrigin('http://nestjs-api:3000/'), 'http://nestjs-api:3000');
  for (const bad of [undefined, '', 'api.example.test',
    'https://user:pass@api.example.test', 'https://api.example.test/v1',
    'https://api.example.test/?q=x', 'javascript:alert(1)',
    'file:///etc/passwd']) assert.throws(() => nestApiOrigin(bad));
});
test('RT-06 URL builder denies URL replacement and normalizes path', () => {
  assert.equal(nestApiUrl('http://nestjs-api:3000', '/routes/abc').toString(),
    'http://nestjs-api:3000/routes/abc');
  assert.throws(() => nestApiUrl('http://nestjs-api:3000', '//evil.test/'));
  assert.throws(() => nestApiUrl(undefined, '/routes/'));
});
test('RT-07 directions require leg and IDs before creating any route', () => {
  const valid = { routes: [{ legs: [{ start_address:'Origem',end_address:'Destino' }] }],
    request:{origin:{place_id:'place_id:ChIJabc'},destination:{place_id:'ChIJxyz'}} };
  assert.deepEqual(parseDirections(valid), {
    startAddress:'Origem',endAddress:'Destino',sourceId:'ChIJabc',destinationId:'ChIJxyz'
  });
  for (const bad of [null, {}, {routes:[]},
    {...valid,routes:[{legs:[]}]},
    {...valid,request:{origin:{place_id:'../bad'},destination:{place_id:'good'}}}])
    assert.equal(parseDirections(bad), null);
});
