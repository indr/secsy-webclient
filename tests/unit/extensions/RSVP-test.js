import { assert } from 'chai';
import { describe, it } from 'mocha';
import RSVP from './../../../extensions/RSVP';

describe('Extension | RSVP', function () {
  describe('Promise#delay', function () {
    it('should resolve with value', function () {
      return RSVP.resolve().delay(100, 'value').then((result) => {
        assert.equal(result, 'value');
      });
    });
    
    it('should be chainable', function () {
      return RSVP.resolve('value').then((result) => {
        return result;
      }).delay(10).delay(10).then((result) => {
        assert.equal(result, 'value');
      });
    });
  });
});

