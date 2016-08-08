import { assert } from 'chai';
import {describeModel, it } from 'ember-mocha';

describeModel('contact', 'Unit | Model | contact', {
  // Specify the other units that are required for this test.
  needs: [
    'validator:presence'
  ]
  },
  function () {

it('it exists', function () {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
});
