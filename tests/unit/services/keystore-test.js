import Ember from 'ember';
import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

describeModule('service:keystore', 'Unit | Service | keystore', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let sut, senecaAuth, session, store;
    
    beforeEach(function (done) {
      this.register('service:seneca-auth', Ember.Object.extend({}));
      senecaAuth = Ember.getOwner(this).lookup('service:seneca-auth');
      this.register('service:session', Ember.Object.extend({data:{authenticated:{user:{}}}}));
      session = Ember.getOwner(this).lookup('service:session');
      
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
      it('updates users privateKey and publicKey and returns key', function (done) {
        senecaAuth.updateUser = function () {
          assert.equal(arguments[0], null);
          assert.equal(arguments[1], null);
          assert.equal(arguments[2], null);
          assert.equal(arguments[3], 'user@example.com');
          assert.deepEqual(arguments[4], {
            publicKey: 'pub',
            privateKey: 'priv'
          });
          return Ember.RSVP.resolve();
        };
        
        sut.save('123abc', 'user@example.com',
          {key: '1', publicKeyArmored: 'pub', privateKeyArmored: 'priv'}).then((key) => {
          assert.equal(key, '1');
          assert.equal(session.get('data.authenticated.user.publicKey'), 'pub');
          assert.equal(session.get('data.authenticated.user.privateKey'), 'priv');
          done();
        });
      });
    });
  }
);
