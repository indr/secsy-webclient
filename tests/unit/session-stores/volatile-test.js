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
import simple from 'simple-mock';

import ENV from 'secsy-webclient/config/environment';

const base64regex = /^[a-z0-9\+\/]+==$/i;

describeModule('session-store:volatile', 'Unit | Session store | volatile', {},
  function () {
    let config, createSut, sut, adaptiveStore, windowStore;
    
    beforeEach(function () {
      ENV['secure-store'] = config = {};
      createSut = function () {
        sut = this.subject();
        adaptiveStore = sut.get('_adaptiveStore');
        windowStore = sut.get('_windowStore');
        return sut;
      }.bind(this);
    });
    
    describe('#init', function () {
      it('should set adaptive stores local storage key', function () {
        createSut();
        
        assert.equal(adaptiveStore.localStorageKey, 'ember_simple_auth:volatile');
      });
      
      it('should set adaptive stores cookie name', function () {
        createSut();
        
        assert.equal(adaptiveStore.cookieName, 'ember_simple_auth:volatile');
      });
    });
    
    describe('#persist', function () {
      const data = {p1: 'p1', p2: 'p2'};
      let adaptivePersist, windowPersist;
      
      it('should persist given no whitelist', function () {
        delete config.volatile;
        createSut();
        adaptivePersist = simple.mock(adaptiveStore, 'persist');
        windowPersist = simple.mock(windowStore, 'persist');
        
        return sut.persist(data).then(() => {
          let arg = adaptivePersist.lastCall.arg;
          assert.sameMembers(Object.keys(arg), ['p1', 'p2']);
          assert.match(arg.p1, base64regex);
          assert.match(arg.p2, base64regex);
          
          arg = windowPersist.lastCall.arg;
          assert.sameMembers(Object.keys(arg), ['p1', 'p2']);
          assert.match(arg.p1, base64regex);
          assert.match(arg.p2, base64regex);
        });
      });
      
      it('should persist given whitelist', function () {
        config.volatile = 'p1';
        createSut();
        adaptivePersist = simple.mock(adaptiveStore, 'persist');
        windowPersist = simple.mock(windowStore, 'persist');
        
        return sut.persist(data).then(() => {
          let arg = adaptivePersist.lastCall.arg;
          assert.sameMembers(Object.keys(arg), ['p1']);
          assert.match(arg.p1, base64regex);
          
          arg = windowPersist.lastCall.arg;
          assert.sameMembers(Object.keys(arg), ['p1']);
          assert.match(arg.p1, base64regex);
        });
      });
      
      it('should resolve with undefined', function () {
        createSut();
        
        return sut.persist(data).then((result) => {
          assert.isUndefined(result);
        });
      });
      
      it('should reject with adaptive stores Error', function () {
        createSut();
        simple.mock(adaptiveStore, 'persist').rejectWith(new Error('adaptive persist error'))
        simple.mock(windowStore, 'persist').resolveWith();
        
        return sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptive persist error');
        });
      });
      
      it('should reject with window stores Error', function () {
        createSut();
        simple.mock(adaptiveStore, 'persist').resolveWith();
        simple.mock(windowStore, 'persist').rejectWith(new Error('window persist error'))
        
        return sut.persist({}).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'window persist error');
        });
      });
    });
    
    describe('#restore', function () {
      const p1s1 = 'e+s9mnuVGDptGAJR3YICVyc7jCoecrtGKfoA7FqbzHa52OvI5+HF0jQqB91adunKQB9PTCsrlI5xnDaqcsWOx03LETsDsJV72bdn4q25AxRgveLuVDbvPu46cu6ZABMQExcthjK3jcLWELBCuTVGANxoI48Tea26uOvx2lTZknFRl3Ds+LHy/kRE/2p0QCl4HWap3zy4JzlsBx4M9vcOCjSXkAc8ziVjgdq1dx9qae0FS5EQiuzaU43VU9yg+Wgrfo6OXkoeaHGX3ABA+t+KXA2LeT3yr2Iniv9UMfKGEZAGvBFLlP006BXuaZfq2quREv1rMn9mhN+xINt08JWHPg==';
      const p1s2 = 'WZsMuHuVGDptGAJR3YICVyc7jCoecrtGKfoA7FqbzHa52OvI5+HF0jQqB91adunKQB9PTCsrlI5xnDaqcsWOx03LETsDsJV72bdn4q25AxRgveLuVDbvPu46cu6ZABMQExcthjK3jcLWELBCuTVGANxoI48Tea26uOvx2lTZknFRl3Ds+LHy/kRE/2p0QCl4HWap3zy4JzlsBx4M9vcOCjSXkAc8ziVjgdq1dx9qae0FS5EQiuzaU43VU9yg+Wgrfo6OXkoeaHGX3ABA+t+KXA2LeT3yr2Iniv9UMfKGEZAGvBFLlP006BXuaZfq2quREv1rMn9mhN+xINt08JWHPg==';
      const p2s1 = 'ZDAUvnKD5E4Zte3+xZ7xb+vNa77fAZGvCozPvDrnL5dIBCLiH+PAssB4wbj9VR9POR6BRZ93Za3H9LGLJwFZJ6KQoL+8CXILSeEOMUfDiNxagyWBkQn/DKzSYigwoKDZP3d8+/KlOCiI7iY4B5BJxCuX9we2DrQDGVpFuifeeKX/zNyIDcOFdLKQkzkEI3NpVmmdQtFRwoZbFdP70uxeuA+e/199lk/FmmaVVDiiTm9sdmLT5HpVSqOUGV+sqUrgWUDRC08LujTtp923Ds+f/Os41JAWy9fvww8Fr7OMcv1mZTPLakeBQq2cz72d+u2boxa2+Z5j4fiPBOp1jkw5gA==';
      const p2s2 = 'RkAmnHKD5E4Zte3+xZ7xb+vNa77fAZGvCozPvDrnL5dIBCLiH+PAssB4wbj9VR9POR6BRZ93Za3H9LGLJwFZJ6KQoL+8CXILSeEOMUfDiNxagyWBkQn/DKzSYigwoKDZP3d8+/KlOCiI7iY4B5BJxCuX9we2DrQDGVpFuifeeKX/zNyIDcOFdLKQkzkEI3NpVmmdQtFRwoZbFdP70uxeuA+e/199lk/FmmaVVDiiTm9sdmLT5HpVSqOUGV+sqUrgWUDRC08LujTtp923Ds+f/Os41JAWy9fvww8Fr7OMcv1mZTPLakeBQq2cz72d+u2boxa2+Z5j4fiPBOp1jkw5gA==';
      const data1 = {p1: p1s1, p2: p2s1};
      const data2 = {p1: p1s2, p2: p2s2};
      
      it('should resolve given no whitelist', function () {
        delete config.volatile;
        createSut();
        simple.mock(adaptiveStore, 'restore').resolveWith(data1);
        simple.mock(windowStore, 'restore').resolveWith(data2);
        
        return sut.restore((data) => {
          assert.deepEqual(data, {p1: 'p1', p2: 'p2'});
        });
      });
      
      it('should resolve only whitelisted properties', function () {
        config.volatile = 'p1';
        createSut();
        simple.mock(adaptiveStore, 'restore').resolveWith(data1);
        simple.mock(windowStore, 'restore').resolveWith(data2);
        
        return sut.restore((data) => {
          assert.deepEqual(data, {p1: 'p1'});
        });
      });
      
      it('should reject with adaptive stores error', function () {
        createSut();
        simple.mock(adaptiveStore, 'restore').rejectWith(new Error('adaptive restore error'));
        simple.mock(windowStore, 'restore').resolveWith({});
        
        return sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptive restore error');
        });
      });
      
      it('should reject with window stores error', function () {
        createSut();
        simple.mock(adaptiveStore, 'restore').resolveWith({});
        simple.mock(windowStore, 'restore').rejectWith(new Error('window restore error'));
        
        return sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'window restore error');
        });
      });
    });
    
    describe('#clear', function () {
      let adaptiveClear, windowClear;
      
      beforeEach(function () {
        createSut();
        adaptiveClear = simple.mock(adaptiveStore, 'clear');
        windowClear = simple.mock(windowStore, 'clear');
      });
      
      it('should clear adaptive, window store and return undefined', function () {
        adaptiveClear.resolveWith('result 1');
        windowClear.resolveWith('result 2');
        
        return sut.clear().then((result) => {
          assert.isTrue(adaptiveClear.called);
          assert.isTrue(windowClear.called);
          assert.isUndefined(result);
        });
      });
      
      it('should reject with adaptive stores Error', function () {
        adaptiveClear.rejectWith(new Error('adaptive clear error'));
        windowClear.resolveWith();
        
        return sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'adaptive clear error');
        });
      });
      
      it('should reject with window stores Error', function () {
        adaptiveClear.resolveWith();
        windowClear.rejectWith(new Error('window clear error'));
        
        return sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'window clear error');
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
    
    describe('event sessionDataUpdated', function () {
      beforeEach(function () {
        createSut();
      });
      
      // TODO: Should not trigger?
      it('should fire sessionDataUpdate if adaptive store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        adaptiveStore.trigger('sessionDataUpdated', data);
        
        assert.isTrue(handler.called);
        assert.equal(handler.lastCall.arg, data);
      });
      
      // TODO: Should not trigger?
      it('should fire sessionDataUpdate if window store fires', function () {
        let handler = simple.mock();
        sut.on('sessionDataUpdated', handler);
        
        const data = {};
        windowStore.trigger('sessionDataUpdated', data);
        
        assert.isTrue(handler.called);
        assert.equal(handler.lastCall.arg, data);
      });
    });
  }
);
