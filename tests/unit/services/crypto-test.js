import { moduleFor, test } from 'ember-qunit';

moduleFor('service:crypto', 'Unit | Service | crypto', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function (assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it encrypts an object', function (assert) {
  const service = this.subject();
  const plain = {
    a: 'foo',
    b: {b1: 'bar'}
  };
  const encrypted = service.encrypt(plain);
  assert.equal(encrypted.algorithm, 'base64');
  assert.ok(encrypted.data);
});

test('it encrypts and decrypts', function (assert) {
  const service = this.subject();
  const expected = {
    a: 'foo'
  };
  const actual = service.decrypt(service.encrypt(expected));
  assert.deepEqual(expected, actual);
});
