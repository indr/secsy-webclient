import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

import { aks, keys } from '../../keys';
const { RSVP } = Ember;


describeModule('service:keychain', 'Unit | Service | keychain', {
    // Specify the other units that are required for this test.
    needs: [
      'service:keystore',
      'service:session',
      'service:openpgp']
  },
  function () {
    let sut;
    
    beforeEach(function (done) {
      sut = this.subject();
      sut.get('keystore').load = () => RSVP.resolve(aks[0]);
      sut.get('keystore').save = () => RSVP.resolve();
      sut.get('openpgp').generateKey = () => RSVP.resolve({ key: keys[0][1] });
      done();
    });
    
    
    describe('getPublicKey()', function () {
      it('throws if keychain is not open', function () {
        assert.throws(() => sut.getPublicKey());
      });
    });
    
    describe('getPrivateKey()', function () {
      it('throws if keychain is not open', function () {
        assert.throws(() => sut.getPrivateKey());
      });
    });
    
    describe('open()', function () {
      it('throws with invalid passphrase', function (done) {
        sut.open('abc123', 'invalid-passphrase').then(assert.fail).catch((err) => {
          assert.equal(err.message, 'Error decrypting private key: Invalid passphrase');
          done();
        });
      });
      
      it('resolves with valid passphrase', function (done) {
        sut.get('keystore').load = () => RSVP.resolve(aks[0]);
        
        sut.open('abc123', 'secret').then(done).catch(assert.fail);
      });
      
      // TODO: How to unit test events?
      it('triggers keychainOpened'/*, function (done) {
       sut.on('keychainOpened', function () {
       done();
       });
       }*/);
      
      it('is open and has public and private key', function (done) {
        sut.open('abc123', 'secret').then(function () {
          assert.isTrue(sut.get('isOpen'));
          assert(sut.getPublicKey());
          assert(sut.getPrivateKey());
          done();
        });
      });
    });
    
    describe('close()', function () {
      it('is not open', function (done) {
        sut.open('abc123', 'secret').then(function () {
          sut.close();
          assert.isFalse(sut.get('isOpen'));
          done();
        });
      });
      
      // TODO: How to unit test events?
      it('triggers keychainClosed');
    });
    
    describe('generateKey()', function () {
      it('is open and has public and private key', function (done) {
        sut.generateKey('abc123', 'user@example.com', 'secret').then(() => {
          assert.isTrue(sut.get('isOpen'));
          
          // Note: generateKey returns one key, which contains the public and private key
          assert.equal(sut.getPublicKey(), keys[0][1]);
          assert.equal(sut.getPrivateKey(), keys[0][1]);
          done();
        });
      });
    });
  }
);

