import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel(
  'share',
  'Unit | Model | share',
  {
    // Specify the other units that are required for this test.
      needs: []
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      let model = this.subject();
      assert.ok(model);
    });
  }
);
