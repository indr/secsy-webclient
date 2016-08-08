import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('route:index', 'Unit | Route | index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  },
  function () {

it('it exists', function () {
  let route = this.subject();
  assert.ok(route);
});
});
