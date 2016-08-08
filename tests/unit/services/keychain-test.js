import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('service:keychain', 'Unit | Service | keychain', {
    // Specify the other units that are required for this test.
    needs: [
      'service:session',
      'service:openpgp']
  },
  function () {
    
    // Replace this with your real tests.
    it('it exists', function () {
      let service = this.subject();
      assert.ok(service);
    });

// So slow...
// it('generateKey: it generates a new key pair', function () {
//   QUnit.config.testTimeout = 1000 * 60 * 4;
//   const sut = this.subject();
//   sut.generateKey('abc123', 'user@example.com', 'secret passphrase', 1).then((key) => {
//     assert.equal(key.privateKeyArmored.indexOf('-----BEGIN PGP PRIVATE KEY BLOCK'), 0);
//     assert.equal(key.publicKeyArmored.indexOf('-----BEGIN PGP PUBLIC KEY BLOCK'), 0);
//     done();
//   }).catch(() => {
//     done();
//   });
// });
  });
