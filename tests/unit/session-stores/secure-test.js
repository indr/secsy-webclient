import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import simple from 'simple-mock';

describeModule('session-store:secure', 'Unit | Session store | secure', {},
  function () {
    let sut, adaptive, window;
    
    beforeEach(function () {
      sut = this.subject();
      adaptive = sut.get('_adaptiveStore');
      window = sut.get('_windowStore');
    });
    
    describe('sessionDataUpdated', function () {
      beforeEach(function () {
        
      });
      
      it('should fire sessionDataUpdate if adaptive store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        adaptive.trigger('sessionDataUpdated', data);
        
        assert.isTrue(handler.called);
        assert.equal(handler.lastCall.arg, data);
      });
      
      it('should fire sessionDataUpdate if window store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        window.trigger('sessionDataUpdated', data);
        
        assert.isTrue(handler.called);
        assert.equal(handler.lastCall.arg, data);
      });
    });
    
    describe('#persist', function () {
      let adaptivePersist, windowPersist;
      
      beforeEach(function () {
        adaptivePersist = simple.mock(adaptive, 'persist');
        windowPersist = simple.mock(window, 'persist');
      });
      
      const data = {
        p1: 'p1',
        p2: 'p2',
        o1: {
          p1: 1,
          p2: 2,
          o2: {
            p1: 5.11
          }
        }
      };
      
      it('should persist to adaptive, window store and return undefined', function (done) {
        adaptivePersist.resolveWith('adaptivePersist');
        windowPersist.resolveWith('windowPersist');
        sut.persist(data).then((result) => {
          assert.isTrue(adaptivePersist.called);
          assert.isTrue(windowPersist.called);
          assert.isUndefined(result);
          done();
        });
      });
      
      it('should persist secured properties to window store', function (done) {
        sut.set('secured', ['p1', 'notExisting', 'o1.p2', 'o1.o2.p1']);
        
        sut.persist(data).then(() => {
          assert.deepEqual(windowPersist.lastCall.arg, {p1: 'p1', o1: {p2: 2, o2: {p1: 5.11}}});
          done();
        });
      });
      
      it('should not persist secured properties to adapative store', function (done) {
        sut.set('secured', ['p1', 'notExisting', 'o1.p2', 'o1.o2.p1']);
        
        sut.persist(data).then(() => {
          assert.deepEqual(adaptivePersist.lastCall.arg, {p2: 'p2', o1: {p1: 1, o2: {}}});
          done();
        });
      });
      
      it('should reject with adaptive stores Error', function (done) {
        adaptivePersist.rejectWith(new Error('adaptivePersist'));
        windowPersist.resolveWith();
        
        sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptivePersist');
          done();
        });
      });
      
      it('should reject with window stores Error', function (done) {
        adaptivePersist.resolveWith();
        windowPersist.rejectWith(new Error('windowPersist'));
        
        sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'windowPersist');
          done();
        });
      });
    });
    
    describe('#restore', function () {
      let adaptiveRestore, windowRestore;
      
      beforeEach(function () {
        adaptiveRestore = simple.mock(adaptive, 'restore');
        windowRestore = simple.mock(window, 'restore');
      });
      
      it('should resolve with combined store data', function (done) {
        adaptiveRestore.resolveWith({p1: 'p1'});
        windowRestore.resolveWith({p2: 'p2'});
        
        sut.restore().then((result) => {
          assert.deepEqual(result, {p1: 'p1', p2: 'p2'});
          done();
        });
      });
      
      it('should reject with adaptive stores Error', function (done) {
        adaptiveRestore.rejectWith(new Error('adaptiveRestore'));
        windowRestore.resolveWith();
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptiveRestore');
          done();
        });
      });
      
      it('should reject with window stores Error', function (done) {
        adaptiveRestore.resolveWith();
        windowRestore.rejectWith(new Error('windowRestore'));
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'windowRestore');
          done();
        });
      });
    });
    
    describe('#clear', function () {
      let adaptiveClear, windowClear;
      
      beforeEach(function () {
        adaptiveClear = simple.mock(adaptive, 'clear');
        windowClear = simple.mock(window, 'clear');
      });
      
      it('should clear adaptive, window store and return undefined', function (done) {
        adaptiveClear.resolveWith('result 1');
        windowClear.resolveWith('result 2');
        
        sut.clear().then((result) => {
          assert.isTrue(adaptiveClear.called);
          assert.isTrue(windowClear.called);
          assert.isUndefined(result);
          done();
        });
      });
      
      it('should reject with adaptive stores Error', function (done) {
        adaptiveClear.rejectWith(new Error('adaptiveClear'));
        windowClear.resolveWith();
        
        sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptiveClear');
          done();
        });
      });
      
      it('should reject with window stores Error', function (done) {
        adaptiveClear.resolveWith();
        windowClear.rejectWith(new Error('windowClear'));
        
        sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'windowClear');
          done();
        });
      });
    });
  }
);
