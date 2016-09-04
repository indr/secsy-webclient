import Ember from 'ember';
import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

import { aks } from '../../keys';

const {RSVP} = Ember;

describeModule('service:keystore', 'Unit | Service | keystore', {
    // Specify the other units that are required for this test.
    needs: ['service:openpgp']
  },
  function () {
    let sut, senecaAuth, session, store;
    
    beforeEach(function (done) {
      this.register('service:seneca-auth', Ember.Object.extend({}));
      senecaAuth = Ember.getOwner(this).lookup('service:seneca-auth');
      this.register('service:session', Ember.Object.extend({data: {authenticated: {user: {}}}}));
      session = Ember.getOwner(this).lookup('service:session');
      session.set('data.authenticated.private_key', aks[0][1]);
      
      // TODO: Remove keystores dependency on store
      store = Ember.getOwner(this).lookup('service:store');
      store.createRecord = function () {
        return store;
      };
      store.save = function () {
        return Ember.RSVP.resolve();
      };
      
      sut = this.subject();
      done();
    });
    
    describe('save()', function () {
      it('saves a new key record, updates session keys and returns key', function (done) {
        var fakeKey;
        store.createRecord = function (type, data) {
          assert.equal(type, 'key');
          fakeKey = data;
          return {
            save: function () {
              return RSVP.resolve(this);
            }
          };
        };
        
        sut.save('123abc', 'user@example.com',
          {key: '1', publicKeyArmored: 'pub', privateKeyArmored: 'priv'}).then((result) => {
          assert.equal(fakeKey.privateKey, 'priv');
          assert.equal(fakeKey.publicKey, 'pub');
          assert.equal(fakeKey.isPublic, true);
          assert.equal(session.get('data.authenticated.public_key'), 'pub');
          assert.equal(session.get('data.authenticated.private_key'), 'priv');
          assert.equal(result, '1');
          done();
        });
      });
    });
    
    describe('getPrivateKey()', function () {
      it('throws if no private key is present', function () {
        session.set('data.authenticated.private_key', undefined);
        assert.throws(() => sut.getPrivateKey(), 'private-key-not-found');
      });
      
      it('throws with invalid private key', function () {
        session.set('data.authenticated.private_key', 'invalid');
        assert.throws(() => sut.getPrivateKey(), 'Unknown ASCII armor type');
      });
      
      
      it('returns key', function () {
        var key = sut.getPrivateKey();
        assert.isObject(key);
        assert.property(key, 'primaryKey');
      });
    });
  }
);
