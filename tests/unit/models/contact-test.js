import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';

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
    
    it('location', function () {
      let sut = this.subject();
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_latitude$', 45);
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_longitude$', 105);
      assert.deepEqual(sut.get('location'), [45, 105]);
      sut.set('location_latitude$', null);
      assert.deepEqual(sut.get('location'), null);
    });
  }
);
