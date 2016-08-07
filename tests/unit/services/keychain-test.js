import { moduleFor, test } from 'ember-qunit';
import QUnit from 'qunit';

moduleFor('service:keychain', 'Unit | Service | keychain', {
  // Specify the other units that are required for this test.
  needs: [
    'service:session',
    'service:openpgp'],
  
  defaultTestTimeout: QUnit.config.testTimeout,
  beforeEach: function () {
    this.defaultTestTimeout = QUnit.config.testTimeout;
  },
  afterEach: function () {
    QUnit.config.testTimeout = this.defaultTestTimeout;
  }
});

// Replace this with your real tests.
test('it exists', function (assert) {
  let service = this.subject();
  assert.ok(service);
});

// So slow...
// test('generateKey: it generates a new key pair', function (assert) {
//   QUnit.config.testTimeout = 1000 * 60 * 4;
//   const sut = this.subject();
//   assert.expect(2);
//   const done = assert.async();
//   sut.generateKey('abc123', 'user@example.com', 'secret passphrase', 1).then((key) => {
//     assert.equal(key.privateKeyArmored.indexOf('-----BEGIN PGP PRIVATE KEY BLOCK'), 0);
//     assert.equal(key.publicKeyArmored.indexOf('-----BEGIN PGP PUBLIC KEY BLOCK'), 0);
//     done();
//   }).catch(() => {
//     done();
//   });
// });
