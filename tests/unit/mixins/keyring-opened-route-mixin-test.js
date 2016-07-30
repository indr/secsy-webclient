import Ember from 'ember';
import KeyringOpenedRouteMixinMixin from 'addressbook/mixins/keyring-opened-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | keyring opened route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeyringOpenedRouteMixinObject = Ember.Object.extend(KeyringOpenedRouteMixinMixin);
  let subject = KeyringOpenedRouteMixinObject.create();
  assert.ok(subject);
});
