import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

describeModule('service:openpgp', 'Unit | Service | openpgp', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let sut;
    
    beforeEach(function (done) {
      sut = this.subject();
      done();
    });
    
    describe.skip('generateKey()', function () {
      // So slow... This test is for console output purpose only
      it('\nNOTE: The test currently running generates a key pair.' +
        ' This takes a while... in phantomjs...', function () {
        assert(true);
      });
      it('generateKey: it generates a new key pair', function (done) {
        assert.fail('My laptop gets hotter and hotter...');
        this.timeout(1000 * 60 * 10); // 10 Minutes?
        sut.generateKey('user@example.com', 'secret passphrase', 1, true).then((result) => {
          assert.equal(result.privateKeyArmored.indexOf('-----BEGIN PGP PRIVATE KEY BLOCK'), 0);
          assert.equal(result.publicKeyArmored.indexOf('-----BEGIN PGP PUBLIC KEY BLOCK'), 0);
          done();
        }).catch(assert.fail);
      });
    });
  }
);
