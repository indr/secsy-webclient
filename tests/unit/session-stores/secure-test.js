import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import simple from 'simple-mock';

import ENV from 'addressbook/config/environment';

describeModule('session-store:secure', 'Unit | Session store | secure', {},
  function () {
    let config, createSut, sut, adaptive, volatile;
    
    const base64regex = /^[a-z0-9\+\/]+==$/i;
    
    beforeEach(function () {
      ENV['secure-store'] = {};
      ENV['volatile-store'] = {};
      config = {
        secureStore: ENV['secure-store'],
        volatileStore: ENV['volatile-store']
      };
      createSut = function () {
        sut = this.subject();
        adaptive = sut.get('_adaptiveStore');
        volatile = sut.get('_volatileStore');
        return sut;
      }.bind(this);
    });
    
    describe('persist and restore', function () {
      const data = {
        p1: 'p1',
        p2: {p1: 1, p2: 2, o2: {p1: 5.11}},
        p3: 'p3',
        authenticated: {username: 'username'}
      };
      
      it('should be able to persist and restore data without whitelists', function (done) {
        delete config.secureStore.whitelist;
        delete config.volatileStore.whitelist;
        const expected = Ember.copy(data);
        sut = createSut();
        
        sut.persist(data).then(() => {
          return sut.restore();
        }).then((restored) => {
          assert.deepEqual(restored, expected);
          done();
        });
      });
      
      it('should be able to persist and restore data with only a volatile whitelist', function (done) {
        delete config.secureStore.whitelist;
        config.volatileStore.whitelist = ['p3'];
        const expected = Ember.copy(data);
        sut = createSut();
        
        sut.persist(data).then(() => {
          return sut.restore();
        }).then((restored) => {
          assert.deepEqual(restored, expected);
          done();
        });
      });
      
      it('should be able to persist and restore data with withlists', function (done) {
        config.secureStore.whitelist = ['p1', 'p2.p2'];
        config.volatileStore.whitelist = ['p2.o2'];
        const expected = {
          p1: 'p1',
          p2: {p2: 2, o2: {p1: 5.11}},
          authenticated: {username: 'username'}
        };
        sut = createSut();
        
        sut.persist(data).then(() => {
          return sut.restore();
        }).then((restored) => {
          assert.deepEqual(restored, expected);
          done();
        });
      });
    });
    
    describe('sessionDataUpdated', function () {
      beforeEach(function () {
        createSut();
      });
      
      it('should fire sessionDataUpdate if adaptive store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        adaptive.trigger('sessionDataUpdated', data);
        
        assert.isTrue(handler.called);
        assert.equal(handler.lastCall.arg, data);
      });
      
      it('should fire sessionDataUpdate if volatile store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        volatile.trigger('sessionDataUpdated', data);
        
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
      
      let adaptivePersist, volatilePersist;
      
      beforeEach(function () {
        config.secureStore.whitelist = ['p2', 'o1.p1', 'invalid1'];
        config.volatileStore.whitelist = ['p1', 'o1.p2', 'o1.o2', 'invalid2'];
        createSut();
        adaptivePersist = simple.mock(adaptive, 'persist');
        volatilePersist = simple.mock(volatile, 'persist');
      });
      
      it('should persist to adaptive, volatile store and return undefined', function (done) {
        adaptivePersist.resolveWith('adaptivePersist');
        volatilePersist.resolveWith('volatilePersist');
        
        sut.persist(data).then((result) => {
          assert.isTrue(adaptivePersist.called);
          assert.isTrue(volatilePersist.called);
          assert.isUndefined(result);
          done();
        });
      });
      
      it('should persist properties split to volatile store', function (done) {
        sut.persist(data).then(() => {
          const data = volatilePersist.lastCall.arg;
          assert.notEqual(data.p1, 'p1');
          assert.match(data.o1.p2, base64regex);
          assert.match(data.o1.o2, base64regex);
          done();
        });
      });
      
      it('should persist properties split to adaptive store', function (done) {
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
        volatilePersist.resolveWith();
        
        sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptivePersist');
          done();
        });
      });
      
      it('should reject with volatile stores Error', function (done) {
        adaptivePersist.resolveWith();
        volatilePersist.rejectWith(new Error('volatilePersist'));
        
        sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatilePersist');
          done();
        });
      });
    });
    
    describe('#restore', function () {
      let adaptiveRestore, volatileRestore;
      const part1 = '9nVzF86NqzezoJLoyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      const part2 = 'jVcDJuy3iUGCgu/oyasmt9Q2RLokV3gYs6wAr9F9KdviH8Tivc14yy3Q+4ufmDMtaFEulFZ3jvxu/aNCcr5U+h0avZn12MR7b+JJHWAN+sdqcKA+Gvbp3XHPh83b9Ap2W7W5XjWaLsGE3kDM8wU1hzxBwoxNTwQI5335vH7wNdLDv9qJJuP4UuvYOEzvVMV4g1Td5Ytr16/zEF7LJQL+PyVCskJO4X3Sv1+8PcTFlxeZ33RXfDvt5rnq+Rj+fEz1riPW1VigFnGnRGIxBeFF7CFxqQVu+NUftPR66fgq98ARTBooTy/Y/vLl7wVTpJC04I/Rh27N6lRRHqkFH8mSTw=='
      
      beforeEach(function () {
        createSut();
        adaptiveRestore = simple.mock(adaptive, 'restore');
        volatileRestore = simple.mock(volatile, 'restore');
      });
      
      it('should resolve with combined store data', function (done) {
        sut.set('volatilelist', ['both', 'onlyAdaptive', 'onlyVolatile']);
        adaptiveRestore.resolveWith({p1: 'p1', both: part1, onlyAdaptive: 'oA'});
        volatileRestore.resolveWith({'both': part2, 'onlyVolatile': 'oW'});
        
        sut.restore().then((result) => {
          assert.deepEqual(result, {p1: 'p1', both: {p1: 'v1'}});
          done();
        });
      });
      
      it('should reject with adaptive stores Error', function (done) {
        adaptiveRestore.rejectWith(new Error('adaptiveRestore'));
        volatileRestore.resolveWith();
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptiveRestore');
          done();
        });
      });
      
      it('should reject with volatile stores Error', function (done) {
        adaptiveRestore.resolveWith();
        volatileRestore.rejectWith(new Error('volatileRestore'));
        
        sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatileRestore');
          done();
        });
      });
    });
    
    describe('#clear', function () {
      let adaptiveClear, volatileClear;
      
      beforeEach(function () {
        createSut();
        adaptiveClear = simple.mock(adaptive, 'clear');
        volatileClear = simple.mock(volatile, 'clear');
      });
      
      it('should clear adaptive, volatile store and return undefined', function (done) {
        adaptiveClear.resolveWith('result 1');
        volatileClear.resolveWith('result 2');
        
        sut.clear().then((result) => {
          assert.isTrue(adaptiveClear.called);
          assert.isTrue(volatileClear.called);
          assert.isUndefined(result);
          done();
        });
      });
      
      it('should reject with adaptive stores Error', function (done) {
        adaptiveClear.rejectWith(new Error('adaptiveClear'));
        volatileClear.resolveWith();
        
        sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptiveClear');
          done();
        });
      });
      
      it('should reject with volatile stores Error', function (done) {
        adaptiveClear.resolveWith();
        volatileClear.rejectWith(new Error('volatileClear'));
        
        sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatileClear');
          done();
        });
      });
    });
    
    describe('#split', function () {
      beforeEach(function () {
        createSut();
      });
      
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
      
      beforeEach(function () {
        createSut();
      });
      
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