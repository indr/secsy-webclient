import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

describeModule('session-store:window', 'Unit | Session store | window', {},
  function () {
    let sut, window;
    
    beforeEach(function () {
      window = {name: null};
      
      sut = this.subject();
      sut.window = window;
    });
    
    describe('#persist', function () {
      it('should persist empty object', function (done) {
        sut.persist().then(() => {
          assert.equal(window.name, '{}');
          done();
        });
      });
      
      it('should persist a string', function (done) {
        sut.persist('a string').then(() => {
          assert.equal(window.name, '"a string"');
          done();
        });
      });
      
      it('should persist an object', function (done) {
        sut.persist({v1: 's1', o1: {v2: 's2', v3: [1, 2, 3]}}).then(() => {
          assert.equal(window.name, '{"v1":"s1","o1":{"v2":"s2","v3":[1,2,3]}}');
          done();
        });
      });
      
      it('should reject with TypeError given window is not available', function (done) {
        sut.window = null;
        
        sut.persist().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'TypeError');
          done();
        });
      });
    });
    
    describe('#restore', function () {
      it('should resolve with empty object given window.name is null', function (done) {
        window.name = null;
        
        sut.restore().then((data) => {
          assert.deepEqual(data, {});
          done();
        })
      });
      
      it('should resolve with json parsed window name', function (done) {
        const expected = {v1: 's1', o1: {v2: 's2', v3: [1, 2, 3]}};
        window.name = JSON.stringify(expected);
        
        sut.restore().then((actual) => {
          assert.deepEqual(actual, expected);
          done();
        })
      });
      
      it('should reject with SyntaxError given parse failed', function (done) {
        window.name = 'A windows name';
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'SyntaxError');
          done();
        });
      });
      
      it('should reject with TypeError given window is not available', function (done) {
        sut.window = null;
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'TypeError');
          done();
        });
      });
    });
    
    describe('#clear', function () {
      it('should set window.name to null', function (done) {
        window.name = 'not null';
        
        sut.clear().then(() => {
          assert.isNull(window.name);
          done();
        });
      });
      
      it('should reject with Error given window is not available', function (done) {
        sut.window = null;
        
        sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'TypeError');
          done();
        });
      });
    });
  }
);
