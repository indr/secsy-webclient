import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('service:crypto', 'Unit | Service | crypto', {
  // Specify the other units that are required for this test.
  needs: [
    'service:keychain',
    'service:keystore',
    'service:openpgp',
    'service:session'
  ]
  },
  function () {

it('it decrypts "base64"', function (done) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const expected = {'foo': 'bar'};
  service.decrypt({algorithm: 'base64', data: 'eyJmb28iOiJiYXIifQ=='}).then((decrypted) => {
    assert.deepEqual(decrypted, expected);
    done();
  });
});

it('it encrypts an object to base64.pgp', function (done) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const plain = {
    a: 'foo',
    b: {b1: 'bar'}
  };
  service.encrypt(plain).then((encrypted) => {
    assert.equal(encrypted.algorithm, 'base64.pgp');
    assert.ok(encrypted.data);
    done();
  });
});

it('it encrypts and decrypts', function (done) {
  const service = this.subject();
  service.get('keychain').passphrase = '1234';
  const expected = {
    a: 'foo'
  };
  service.encrypt(expected).then((encrypted) => {
    return service.decrypt(encrypted);
  }).then((actual) => {
    assert.deepEqual(expected, actual);
    done();
  });
});

it('it rejects with wrong passphrase', function (done) {
  const service = this.subject();
  const keychain = service.get('keychain');
  keychain.passphrase = '1234';
  service.encrypt({a: 'b'}).then((encrypted) => {
    keychain.passphrase = 'wrong';
    return service.decrypt(encrypted);
  }).catch((error) => {
    assert.equal(error, 'decryption-failed');
    done();
  });
});

});
