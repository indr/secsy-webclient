import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { before, beforeEach } from 'mocha';
import { keys } from '../../keys';
import openpgp from 'openpgp';

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
    let sut, keychain;
    
    before(function (done) {
      openpgp.decryptKey({ privateKey: keys[0][1], passphrase: 'secret' }).then(() => done());
    });
    
    beforeEach(function (done) {
      sut = this.subject();
      keychain = sut.get('keychain');
      keychain.getPublicKey = () => keys[0][0];
      keychain.getPrivateKey = () => keys[0][1];
      done();
    });
    
    it('it decrypts "base64"', function (done) {
      const expected = { 'foo': 'bar' };
      sut.decrypt({ algorithm: 'base64', data: 'eyJmb28iOiJiYXIifQ==' }).then((decrypted) => {
        assert.deepEqual(decrypted, expected);
        done();
      });
    });
    
    it('it encrypts an object to base64.pgp', function (done) {
      sut.get('keychain').passphrase = '1234';
      const plain = {
        a: 'foo',
        b: { b1: 'bar' }
      };
      sut.encrypt(plain).then((encrypted) => {
        assert.equal(encrypted.algorithm, 'base64.pgp');
        assert.ok(encrypted.data);
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
      sut.encrypt({ a: 'b' }).then((encrypted) => {
        return sut.decrypt(encrypted);
      }).catch((error) => {
        assert.equal(error.message, 'encryption-failed');
        done();
      });
    });
  }
);
