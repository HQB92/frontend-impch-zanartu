import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPath, isAdminAccount, isSectorAccount, isSectorPath, profilePathFor } from './sector-access.ts';

const pastor = ['PastorSector'];
const admin = ['Administrador'];
const secretario = ['Secretario'];

test('un pastor de sector solo ve el dashboard y /sector', () => {
  for (const path of ['/', '/login', '/dashboard', '/sector/baptism', '/sector/baptism/register',
    '/sector/baptism/edit', '/sector/merriage', '/sector/merriage/register', '/sector/profile']) {
    assert.equal(canAccessPath(pastor, path), true, path);
  }
});

test('un pastor de sector no ve las rutas de Zañartu aunque las escriba a mano', () => {
  for (const path of ['/bank', '/offering', '/expenses', '/members', '/members/edit/1-9', '/customers',
    '/churchs', '/baptism', '/baptism/register', '/merriage', '/inventory', '/rehearsals', '/account',
    '/dashboard/otra']) {
    assert.equal(canAccessPath(pastor, path), false, path);
  }
});

test('una ruta que solo empieza parecido a /sector no cuenta como de sector', () => {
  assert.equal(isSectorPath('/sector'), true);
  assert.equal(isSectorPath('/sector/baptism'), true);
  assert.equal(isSectorPath('/sectores'), false);
  assert.equal(isSectorPath('/sector-x/baptism'), false);
  assert.equal(canAccessPath(pastor, '/sectores'), false);
});

test('el administrador ve los listados y la edición de sector, además de todo lo de Zañartu', () => {
  for (const path of ['/dashboard', '/bank', '/baptism', '/sector/baptism', '/sector/baptism/edit',
    '/sector/merriage', '/sector/merriage/edit']) {
    assert.equal(canAccessPath(admin, path), true, path);
  }
});

test('el administrador no entra al perfil ni a crear registros de sector', () => {
  for (const path of ['/sector/profile', '/sector/baptism/register', '/sector/merriage/register']) {
    assert.equal(canAccessPath(admin, path), false, path);
  }
});

test('otros roles de Zañartu no entran a /sector', () => {
  assert.equal(canAccessPath(secretario, '/sector/baptism'), false);
  assert.equal(canAccessPath(secretario, '/sector/profile'), false);
  assert.equal(canAccessPath(secretario, '/baptism'), true);
  assert.equal(canAccessPath(secretario, '/dashboard'), true);
});

test('roles ausentes o con forma inesperada no rompen ni dan acceso de sector', () => {
  for (const roles of [undefined, null, 'PastorSector', {}, 42, []]) {
    assert.equal(isSectorAccount(roles), false);
    assert.equal(isAdminAccount(roles), false);
    assert.equal(canAccessPath(roles, '/sector/baptism'), false);
    assert.equal(canAccessPath(roles, '/dashboard'), true);
  }
});

test('Administrador y PastorSector a la vez se trata como pastor', () => {
  const ambos = ['Administrador', 'PastorSector'];
  assert.equal(canAccessPath(ambos, '/bank'), false);
  assert.equal(canAccessPath(ambos, '/sector/profile'), true);
});

test('el enlace Mi Perfil lleva a cada cuenta a su propio perfil', () => {
  assert.equal(profilePathFor(pastor), '/sector/profile');
  assert.equal(profilePathFor(admin), '/account');
  assert.equal(profilePathFor(secretario), '/account');
  assert.equal(profilePathFor(undefined), '/account');
  assert.equal(canAccessPath(pastor, profilePathFor(pastor)), true);
});
