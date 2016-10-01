/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

describeModule('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
    });
    
    describe('#onProgress', function () {
      function assertProgressRemoved (done) {
        Ember.run.later(() => {
          assert.equal(sut.progresses.length, 0);
          done();
        }, 1050);
      }
      
      it('should set progresses[0].value and .max', function () {
        sut.onProgress({max: 5, value: 3});
        
        assert.equal(sut.progresses.objectAt(0).get('max'), 5);
        assert.equal(sut.progresses.objectAt(0).get('value'), 3);
      });
      
      it('should set progresses[0].type to success if value === max', function () {
        sut.onProgress({max: 5, value: 5});
        
        assert.equal(sut.progresses.objectAt(0).get('type'), 'success');
      });
      
      it('should set progresses[0].type to danger if done === true and value !== max', function () {
        sut.onProgress({done: true, max: 5, value: 3});
        
        assert.equal(sut.progresses.objectAt(0).get('type'), 'danger');
      });
      
      it('should remove progress after 1 second if value === max', function (done) {
        sut.onProgress({max: 5, value: 5});
        
        assertProgressRemoved(done);
      });
      
      it('should remove progress after 1 second if done:true and value === max', function (done) {
        sut.onProgress({done: true, max: 5, value: 5});
        
        assertProgressRemoved(done);
      });
      
      it('should remove progress after 1 second if done:true and value !== max', function (done) {
        sut.onProgress({done: true, max: 5, value: 3});
        
        assertProgressRemoved(done);
      });
    });
  }
);
