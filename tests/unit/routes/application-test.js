import { assert } from 'chai';
import {describeModule, it } from 'ember-mocha';

describeModule('route:application', 'Unit | Route | application', {
  // Specify the other units that are required for this test.
  needs: [
    'service:intl',
    'service:keychain',
    'service:keystore',
    'service:openpgp',
    'service:session']
  },
  function () {

it('it exists', function () {
  let route = this.subject();
  assert.ok(route);
});
});
