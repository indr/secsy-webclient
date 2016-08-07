import Ember from 'ember';
import KeychainOpenedRouteMixinMixin from 'addressbook/mixins/keychain-opened-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | keychain opened route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeychainOpenedRouteMixinObject = Ember.Object.extend(KeychainOpenedRouteMixinMixin);
  let subject = KeychainOpenedRouteMixinObject.create();
  assert.ok(subject);
});
