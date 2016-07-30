import Ember from 'ember';
import ApplicationRouteMixinMixin from 'addressbook/mixins/application-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | application route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let ApplicationRouteMixinObject = Ember.Object.extend(ApplicationRouteMixinMixin);
  let subject = ApplicationRouteMixinObject.create();
  assert.ok(subject);
});
