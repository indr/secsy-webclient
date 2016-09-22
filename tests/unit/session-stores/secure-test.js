import Ember from 'ember';
import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import simple from 'simple-mock';

describeModule('session-store:secure', 'Unit | Session store | secure', {},
  function () {
    let sut, adaptive, window;
    
    const base64regex = /^[a-z0-9\+\/]+==$/i;
    
    beforeEach(function () {
      sut = this.subject();
      adaptive = sut.get('_adaptiveStore');
      window = sut.get('_windowStore');
    });
    
    describe('persist and restore', function () {
      const data = {
        p1: 'p1',
        p2: 'p2',
        o1: {
          p1: 1, p2: 2,
          o2: {p1: 5.11}
        }
      };
      
      it('should be able to restore persited data', function (done) {
        sut.set('keyNames', ['p1', 'notExisting', 'o1.p2', 'o1.o2']);
        
        const expected = Ember.copy(data, true);
        sut.persist(data).then(()=> {
          return sut.restore();
        }).then((restored) => {
          assert.deepEqual(restored, expected);
          done();
        });
      });
    });
    
    describe('sessionDataUpdated', function () {
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
      const data = {
        p1: 'p1',
        p2: 'p2',
        o1: {
          p1: 1,
          p2: 2,
          o2: {p1: 5.11}
        }
      };
      
      let adaptivePersist, windowPersist;
      
      beforeEach(function () {
        adaptivePersist = simple.mock(adaptive, 'persist');
        windowPersist = simple.mock(window, 'persist');
      });
      
      
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
      
      it('should persist keyNames properties split to window store', function (done) {
        sut.set('keyNames', ['p1', 'notExisting', 'o1.p2', 'o1.o2']);
        
        sut.persist(data).then(() => {
          const data = windowPersist.lastCall.arg;
          assert.notEqual(data['p1'], 'p1');
          assert.match(data['o1.p2'], base64regex);
          assert.match(data['o1.o2'], base64regex);
          done();
        });
      });
      
      it('should persist keyNames properties split to adaptive store', function (done) {
        sut.set('keyNames', ['p1', 'notExisting', 'o1.p2', 'o1.o2']);
        
        sut.persist(data).then(() => {
          const data = adaptivePersist.lastCall.arg;
          assert.match(data.p1, base64regex);
          assert.equal(data.p2, 'p2');
          assert.equal(data.o1.p1, 1);
          assert.match(data.o1.p2, base64regex);
          assert.match(data.o1.o2, base64regex);
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
      const part1 = '9nVzF86NqzezoJLoyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      const part2 = 'jVcDJuy3iUGCgu/oyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      
      beforeEach(function () {
        adaptiveRestore = simple.mock(adaptive, 'restore');
        windowRestore = simple.mock(window, 'restore');
      });
      
      it('should resolve with combined store data', function (done) {
        sut.set('keyNames', ['both', 'onlyAdaptive', 'onlyWindow']);
        
        adaptiveRestore.resolveWith({p1: 'p1', both: part1, onlyAdaptive: 'oA'});
        windowRestore.resolveWith({'both': part2, 'onlyWindow': 'oW'});
        
        sut.restore().then((result) => {
          assert.deepEqual(result, {p1: 'p1', both: {p1: 'v1'}});
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
    
    describe('#split', function () {
      it('should return two base64 encoded parts', function () {
        const data = {p1: 'v1'};
        
        const actual = sut.split(data);
        assert.match(actual[0], base64regex);
        assert.match(actual[1], base64regex);
      })
    });
    
    describe('#merge', function () {
      const part1 = '9nVzF86NqzezoJLoyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      const part2 = 'jVcDJuy3iUGCgu/oyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      
      it('should merge two json parts', function () {
        const actual = sut.merge(part1, part2);
        assert.deepEqual(actual, {p1: 'v1'});
      });
      
      it('should return undefined if second part is undefind', function () {
        const actual = sut.merge(part1, undefined);
        assert.isUndefined(actual);
      });
      
      it('should return undefined if first part is undefined', function () {
        const actual = sut.merge(undefined, part2);
        assert.isUndefined(actual);
      });
    });
  }
);
