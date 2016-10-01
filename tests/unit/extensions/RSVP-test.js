/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

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
    
    it('should resolve after given milliseconds', function () {
      const ms = 500;
      const start = new Date();
      return RSVP.resolve().delay(ms).then(() => {
        const end = new Date();
        assert.isAbove(end - start, ms - 1);
      });
    });
  });
});

