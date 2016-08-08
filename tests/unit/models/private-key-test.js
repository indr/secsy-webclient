import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel('private-key', 'Unit | Model | private key', {
  // Specify the other units that are required for this test.
  needs: []
  },
  function () {

it('it exists', function () {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
});
