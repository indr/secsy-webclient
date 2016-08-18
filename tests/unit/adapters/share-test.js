import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule(
  'adapter:share',
  'Unit | Adapter | share',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function () {
    // Replace this with your real tests.
    it('exists', function () {
      const adapter = this.subject();
      assert.isNotNull(adapter);
    });
  }
);
