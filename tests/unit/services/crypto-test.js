import { moduleFor, test } from 'ember-qunit';

moduleFor('service:crypto', 'Unit | Service | crypto', {
  // Specify the other units that are required for this test.
  needs: [
    'service:keychain',
    'service:keystore',
    'service:openpgp',
    'service:session'
  ]
});

test('it decrypts "base64"', function (assert) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const expected = {'foo': 'bar'};
  assert.expect(1);
  var done = assert.async();
  service.decrypt({algorithm: 'base64', data: 'eyJmb28iOiJiYXIifQ=='}).then((decrypted) => {
    assert.deepEqual(decrypted, expected);
    done();
  });
});

test('it encrypts an object to base64.pgp', function (assert) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const plain = {
    a: 'foo',
    b: {b1: 'bar'}
  };
  assert.expect(2);
  var done = assert.async();
  service.encrypt(plain).then((encrypted) => {
    assert.equal(encrypted.algorithm, 'base64.pgp');
    assert.ok(encrypted.data);
    done();
  });
});

test('it encrypts and decrypts', function (assert) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const expected = {
    a: 'foo'
  };
  assert.expect(1);
  var done = assert.async();
  service.encrypt(expected).then((encrypted) => {
    return service.decrypt(encrypted);
  }).then((actual) => {
    assert.deepEqual(expected, actual);
    done();
  });
});

test('it rejects with wrong passphrase', function (assert) {
  const service = this.subject();
  const keychain = service.get('keychain');
  keychain.passphrase = '1234';
  assert.expect(1);
  const done = assert.async();
  service.encrypt({a: 'b'}).then((encrypted) => {
    keychain.passphrase = 'wrong';
    return service.decrypt(encrypted);
  }).catch((error) => {
    assert.equal(error, 'decryption-failed');
    done();
  });
});

