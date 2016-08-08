import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('adapter:application', 'Unit | Adapter | application', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  },
  function () {

// Replace this with your real tests.
it('it exists', function () {
  let adapter = this.subject();
  assert.ok(adapter);
});
});
