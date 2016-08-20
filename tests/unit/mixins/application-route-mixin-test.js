import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';

import ApplicationRouteMixin from 'addressbook/mixins/application-route-mixin';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

describeModule('mixin:application-route-mixin', 'Unit | Mixin | application route mixin', {
    needs: [
      'service:keystore',
      'service:keychain',
      'service:openpgp',
      'service:session'],
    
    subject() {
      const name = 'test-container:application-route-mixin-object';
      this.register(name, Ember.Object.extend(ApplicationRouteMixin));
      return Ember.getOwner(this).lookup(name);
    }
  },
  function () {
    
    it('it works', function () {
      const sut = this.subject();
      assert.ok(sut);
    });
  }
);
