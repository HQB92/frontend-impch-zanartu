import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRutInput, isValidRut } from './rut.ts';

test('formatea un RUT completo sin importar cómo se escriba', () => {
  assert.equal(formatRutInput('181562714'), '18.156.271-4');
  assert.equal(formatRutInput('18156271-4'), '18.156.271-4');
  assert.equal(formatRutInput('18.156.271-4'), '18.156.271-4');
  assert.equal(formatRutInput(' 18 156 271-4 '), '18.156.271-4');
});

test('la k del dígito verificador queda en mayúscula', () => {
  assert.equal(formatRutInput('12345678-k'), '12.345.678-K');
});

test('mientras se escribe, un RUT incompleto no se formatea', () => {
  assert.equal(formatRutInput('1815'), '1815');
  assert.equal(formatRutInput('1815627'), '1815627');
  assert.equal(formatRutInput(''), '');
  assert.equal(formatRutInput('   '), '');
});

test('valida el dígito verificador', () => {
  assert.equal(isValidRut('18.156.271-4'), true);
  assert.equal(isValidRut('18156271-4'), true);
  assert.equal(isValidRut('18.156.271-5'), false);
});

test('texto que no es un RUT es inválido y no lanza', () => {
  for (const value of ['', 'abc', 'abcdefghij', '-', '....']) {
    assert.equal(isValidRut(value), false, value);
    assert.doesNotThrow(() => formatRutInput(value));
  }
});
