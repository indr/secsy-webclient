/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

describeModule('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
    });
    
    describe('#normalizeErrorResponse', function () {
      it('should return generic error message given unrecognized payload', function () {
        const errors = sut.normalizeErrorResponse(404, {}, 'something bad happened');
        
        assert.lengthOf(errors, 1);
        assert.equal(errors[0].status, '404');
        assert.equal(errors[0].message, 'generic-backend-error');
        assert.equal(errors[0].detail, 'something bad happened');
      });
      
      it('should return error message and status given no fields', function () {
        const errors = sut.normalizeErrorResponse(404, {}, {status: 500, message: 'backend-message'});
        
        assert.lengthOf(errors, 1);
        assert.equal(errors[0].status, '500');
        assert.equal(errors[0].message, 'backend-message');
        assert.equal(errors[0].detail, '{"status":500,"message":"backend-message"}')
      });
      
      it('should return errors with detail and source', function () {
        const payload = {
          status: 400, message: 'Validation failed', fields: [{
            field: 'username',
            validation: 'unique',
            message: 'username has already been taken by someone else'
          }, {
            field: 'email',
            validation: 'required',
            message: 'email is required'
          }]
        };
        
        const errors = sut.normalizeErrorResponse(400, {}, payload);
        
        assert.lengthOf(errors, 2);
        assert.equal(errors[0].detail, 'unique-username');
        assert.equal(errors[0].source.pointer, 'data/attributes/username');
        assert.equal(errors[1].detail, 'required');
        assert.equal(errors[1].source.pointer, 'data/attributes/email');
      });
    });
  }
);
