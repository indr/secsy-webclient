import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { before, beforeEach, describe } from 'mocha';
import { keys } from '../../keys';
import openpgp from 'openpgp';

describeModule('service:crypto', 'Unit | Service | CryptoService', {
    // Specify the other units that are required for this test.
    needs: [
      'service:keychain',
      'service:keystore',
      'service:openpgp',
      'service:session'
    ]
  },
  function () {
    let sut, keychain;
    
    before(function (done) {
      openpgp.decryptKey({privateKey: keys[0][1], passphrase: 'secret'}).then(() => done());
    });
    
    beforeEach(function (done) {
      sut = this.subject();
      keychain = sut.get('keychain');
      keychain.getPublicKey = () => keys[0][0];
      keychain.getPrivateKey = () => keys[0][1];
      done();
    });
    
    describe('#decrypt', function () {
      it('it decrypts "base64"', function (done) {
        const expected = {'foo': 'bar'};
        sut.decrypt('base64///eyJmb28iOiJiYXIifQ==').then((decrypted) => {
          assert.deepEqual(decrypted, expected);
          done();
        });
      });
    });
    
    describe('#encrypt', function () {
      it('it encrypts an object to base64.pgp', function (done) {
        const plain = {
          a: 'foo',
          b: {b1: 'bar'}
        };
        sut.encrypt(plain).then((encrypted) => {
          assert.ok(encrypted);
          encrypted = encrypted.split('///');
          assert.equal(encrypted[0], 'base64.pgp');
          assert.ok(encrypted[1]);
          done();
        });
      });
      
      it('it encrypts and decrypts with default algorithm', function (done) {
        const expected = {
          a: 'foo'
        };
        sut.encrypt(expected).then((encrypted) => {
          return sut.decrypt(encrypted);
        }).then((actual) => {
          assert.deepEqual(expected, actual);
          done();
        });
      });
      
      it('encrypt() rejects if keychain is not open', function (done) {
        keychain.getPublicKey = keychain.getPrivateKey = function () {
          throw new Error('getKey error');
        };
        sut.encrypt({a: 'b'}).then((encrypted) => {
          return sut.decrypt(encrypted);
        }).catch((error) => {
          assert.equal(error.message, 'encryption-failed');
          done();
        });
      });
    });
    
    describe('#hashEmail()', function () {
      it('hashes a given email address', function () {
        var hash = sut.hashEmail('admin@example.com');
        assert.equal(hash, 'acc1d58b886b138d10a6c33aad693262ddf71e7170a6a2b78fdb9c1effcdd7f1');
      })
    })
  }
);
