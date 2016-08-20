import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';

import DecryptedRouteMixin from 'addressbook/mixins/decrypted-route-mixin';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

describeModule('mixin:decrypted-route-mixin', 'Unit | Mixin | decrypted route mixin', {
    needs: [
      'service:keychain'
    ],
    
    subject() {
      const name = 'test-container:decrypted-route-mixin-object';
      this.register(name, Ember.Object.extend(DecryptedRouteMixin));
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
