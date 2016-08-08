import { assert } from 'chai';
import Ember from 'ember';
import KeychainOpenedRouteMixinMixin from 'addressbook/mixins/keychain-opened-route-mixin';
import { describe, it } from 'mocha';

describe('Unit | Mixin | keychain opened route mixin', function () {

// Replace this with your real tests.
it('it works', function () {
  let KeychainOpenedRouteMixinObject = Ember.Object.extend(KeychainOpenedRouteMixinMixin);
  let subject = KeychainOpenedRouteMixinObject.create();
  assert.ok(subject);
  },
  function () {
});
});
