import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import simple from 'simple-mock';

import ApplicationRouteMixin from 'addressbook/mixins/application-route-mixin';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

const Base = Ember.Object.extend({});

describeModule('mixin:application-route-mixin', 'Unit | Mixin | application route mixin', {
    needs: [
      'service:keystore',
      'service:keychain',
      'service:openpgp',
      'service:session'],
    
    subject() {
      const name = 'test-container:application-route-mixin-object';
      this.register(name, Base.extend(ApplicationRouteMixin));
      return Ember.getOwner(this).lookup(name);
    }
  },
  function () {
    var keychain;
    
    beforeEach(function () {
      this.register('service:keychain', Ember.Object.extend(Ember.Evented, {}));
      keychain = Ember.getOwner(this).lookup('service:keychain');
    });
    
    describe('#init', function () {
      it('should call super and subscribe to keychains keychainOpened event', function () {
        const init = simple.mock(Base.prototype, 'init');
        const on = simple.mock(keychain, 'on');
        
        this.subject();
        
        assert.isTrue(init.called);
        assert.equal(on.lastCall.args[0], 'keychainOpened');
      });
    });
    
    describe('event keychain#keychainOpened', function () {
      it('should remove and retry keychains attempted transition', function () {
        const transition = {};
        const retry = simple.mock(transition, 'retry');
        keychain.set('attemptedTransition', transition);
        
        this.subject();
        keychain.trigger('keychainOpened');
        
        assert.isTrue(retry.called);
        assert.isNull(keychain.get('attemptedTransition'));
      });
    });
  }
);
