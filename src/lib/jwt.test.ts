import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeJwtPayload } from './jwt.ts';

const encode = (payload: object): string => Buffer.from(JSON.stringify(payload)).toString('base64url');
const tokenOf = (payload: object): string => `cabecera.${encode(payload)}.firma`;

test('decodifica un payload normal', () => {
  const payload = decodeJwtPayload(tokenOf({ userId: 1, username: 'hugo', roles: ['Administrador'], exp: 1790000000 }));

  assert.deepEqual(payload, { userId: 1, username: 'hugo', roles: ['Administrador'], exp: 1790000000 });
});

test('conserva tildes y eñes en el nombre de la iglesia', () => {
  for (const name of ['San Fabián', 'San Nicolás', 'Ñiquén', 'Zañartu']) {
    assert.equal(decodeJwtPayload(tokenOf({ username: name }))?.username, name);
  }
});

test('acepta los caracteres - y _ propios de base64url', () => {
  const candidates = Array.from({ length: 12 }, (_, n) => ({ username: 'San Fabián', relleno: `${' '.repeat(n)}>>>???` }));
  const payload = candidates.find((candidate) => /-/.test(encode(candidate)) && /_/.test(encode(candidate)));

  assert.ok(payload, 'no se encontró un payload de prueba con - y _');
  assert.deepEqual(decodeJwtPayload(tokenOf(payload)), payload);
});

test('un token mal formado devuelve null en vez de lanzar', () => {
  for (const token of ['', 'sin-puntos', 'a.b', 'a.%%%.c', `a.${Buffer.from('no es json').toString('base64url')}.c`,
    `a.${Buffer.from('"texto"').toString('base64url')}.c`, `a.${Buffer.from('null').toString('base64url')}.c`]) {
    assert.equal(decodeJwtPayload(token), null, token);
  }
});
