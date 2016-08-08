import { assert } from 'chai';
import Ember from 'ember';
import ApplicationRouteMixinMixin from 'addressbook/mixins/application-route-mixin';
import { describeModule, it } from 'ember-mocha';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

describeModule('mixin:application-route-mixin', 'Unit | Mixin | application route mixin', {
  // Specify the other units that are required for this test.
  needs: [
    'service:keystore',
    'service:keychain',
    'service:openpgp',
    'service:session'],
  
  subject() {
    const name = 'test-container:application-route-mixin-object';
    this.register(name, Ember.Object.extend(ApplicationRouteMixinMixin));
    return Ember.getOwner(this).lookup(name);
  }
  },
  function () {

// Replace this with your real tests.
it('it works', function () {
  let subject = this.subject();
  assert.ok(subject);
});
});
