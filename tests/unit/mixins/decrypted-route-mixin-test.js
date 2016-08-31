import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import ENV from 'addressbook/config/environment';
import { beforeEach, describe } from 'mocha';

import DecryptedRouteMixin from 'addressbook/mixins/decrypted-route-mixin';

const {
  K,
  RSVP
} = Ember;

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

describeModule('mixin:decrypted-route-mixin', 'Unit | Mixin | decrypted route mixin', {
    needs: [],
    
    subject() {
      const Base = Ember.Object.extend({
        beforeModel() {
          return RSVP.resolve({this, arguments});
        },
        transitionTo() {
          return RSVP.resolve({this, arguments});
        }
      });
      const name = 'test-container:decrypted-route-mixin-object';
      this.register(name, Base.extend(DecryptedRouteMixin, {}));
      return Ember.getOwner(this).lookup(name);
    }
  },
  function () {
    var sut, keychain, transition;
    
    beforeEach(function () {
      this.register('service:keychain', Ember.Object.extend());
      keychain = Ember.getOwner(this).lookup('service:keychain');
      transition = {abort: K};
      sut = this.subject();
    });
    
    describe('#beforeModel | keychain is open', function () {
      it('should resolve supers promise', function () {
        keychain.isOpen = true;
        
        return sut.beforeModel(transition).then((result) => {
          assert.equal(result.this, sut);
          assert.equal(result.arguments[0], transition);
        });
      });
    });
    
    describe('#beforeModel | keychain is not open', function () {
      beforeEach(function () {
        keychain.isOpen = false;
      });
      
      it('should resolve supers promise if keychain could be restored', function () {
        keychain.restore = () => RSVP.resolve();
        
        return sut.beforeModel(transition).then((result) => {
          assert.equal(result.this, sut);
          assert.equal(result.arguments[0], transition);
        });
      });
      
      it('should assert that decryption route is not equal this route if keychain could not be restored', function () {
        keychain.restore = () => RSVP.reject();
        sut.set('routeName', ENV.APP.decryptionRoute);
        
        return sut.beforeModel(transition).catch((err) => {
          assert.instanceOf(err, Error);
          assert.match(err.message, /The route configured as/);
          return 'ok';
        }).then((ok) => {
          assert(ok === 'ok', 'Expected exception to be thrown but there was none');
        });
      });
      
      it('should abort transition and set keychain.attemptedTransition if keychain could not be restored', function () {
        keychain.restore = () => RSVP.reject();
        var aborted = false;
        var transition = {
          abort: () => aborted = true
        };
        return sut.beforeModel(transition).then(() => {
          assert.isTrue(aborted);
          assert.equal(keychain.get('attemptedTransition'), transition);
        });
      });
      
      it('should return transition to decryption route if keychain could not be restored', function () {
        keychain.restore = () => RSVP.reject();
        
        return sut.beforeModel(transition).then((result) => {
          assert.equal(result.this, sut);
          assert.equal(result.arguments[0], ENV.APP.decryptionRoute);
        });
      });
    });
  }
);
