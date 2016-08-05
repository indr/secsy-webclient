import Ember from 'ember';
import ApplicationRouteMixinMixin from 'addressbook/mixins/application-route-mixin';
import { moduleFor, test } from 'ember-qunit';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

moduleFor('mixin:application-route-mixin', 'Unit | Mixin | application route mixin', {
  // Specify the other units that are required for this test.
  needs: [
    'service:keyring',
    'service:session'],
  
  subject() {
    const name = 'test-container:application-route-mixin-object';
    this.register(name, Ember.Object.extend(ApplicationRouteMixinMixin));
    return Ember.getOwner(this).lookup(name);
  }
});

// Replace this with your real tests.
test('it works', function (assert) {
  let subject = this.subject();
  assert.ok(subject);
});
