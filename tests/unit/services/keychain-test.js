/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

import { aks, keys } from '../../keys';
const {RSVP} = Ember;


describeModule('service:keychain', 'Unit | Service | keychain', {
    // Specify the other units that are required for this test.
    needs: [
      'service:crypto',
      'service:keystore',
      'service:openpgp']
  },
  function () {
    let sut, session;
    
    beforeEach(function (done) {
      this.register('service:session', Ember.Object.extend({
        data: {authenticated: {user: {}}},
        on: function () {
        }
      }));
      session = Ember.getOwner(this).lookup('service:session');
      session.set('data.authenticated.private_key', aks[0][1]);
      this.register('service:seneca-auth', Ember.Object.extend());
      
      sut = this.subject();
      sut.get('keystore').save = () => RSVP.resolve();
      sut.get('openpgp').generateKey = () => RSVP.resolve({key: keys[0][1]});
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
      it('throws with invalid private key', function () {
        session.set('data.authenticated.private_key', 'invalid');
        assert.throws(() => sut.open(), 'Unknown ASCII armor type');
      });
      
      it('rejects with invalid passphrase', function (done) {
        sut.open('abc123', 'invalid-passphrase').then(assert.fail).catch((error) => {
          assert.equal(error.message, 'Error decrypting private key: Invalid passphrase');
          done();
        });
      });
      
      it('resolves with valid passphrase', function (done) {
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

