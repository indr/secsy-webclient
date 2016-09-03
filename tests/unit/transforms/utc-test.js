import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach } from 'mocha';
import moment from 'moment';

describeModule('transform:utc', 'Unit | Transform | utc', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
    });
    
    it('should deserialize', function () {
      var result = sut.deserialize('2016-09-03T20:28:32.000Z');
      assert(result);
    });
    
    it('should serialize', function () {
      var result = sut.serialize(moment());
      assert(result);
    });
  }
);
