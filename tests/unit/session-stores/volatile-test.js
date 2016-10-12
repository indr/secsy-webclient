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
import simple from 'simple-mock';
import utils from 'secsy-webclient/session-stores/utils';

import ENV from 'secsy-webclient/config/environment';

const base64regex = /^[a-z0-9\+\/]+==$/i;

const gWindow = window;

describeModule('session-store:volatile', 'Unit | Session store | volatile', {},
  function () {
    const key = 'ember_simple_auth:volatile';
    
    let config, createSut, sut,
      addEventListener, attachEvent,
      storage, window;
    
    beforeEach(function () {
      window = {
        name: null,
        localStorage: gWindow.localStorage
      };
      addEventListener = simple.mock(window, 'addEventListener');
      attachEvent = simple.mock(window, 'attachEvent');
      storage = window.localStorage;
      utils.window = window;
      
      ENV['secure-store'] = config = {};
      createSut = function () {
        sut = this.subject();
        return sut;
      }.bind(this);
    });
    
    describe('#init', function () {
      it('should clear window.name', function () {
        window.name = 'windows name';
        createSut();
        
        assert.equal(window.name, '');
      });
      
      it('should clear localStorage', function () {
        storage.setItem(key, 'items value');
        createSut();
        
        assert.isNull(storage.getItem(key));
      });
      
      it('should add event listener to unload', function () {
        this.subject();
        
        assert.isTrue(addEventListener.called);
        const args = addEventListener.lastCall.args;
        assert.equal(args[0], 'unload');
        assert.equal(args[1].name, 'flush');
        assert.equal(args[2], false);
      });
      
      it('should attach event given addEventListener is undefined', function () {
        delete window.addEventListener;
        
        this.subject();
        
        assert.isTrue(attachEvent.called);
        const args = attachEvent.lastCall.args;
        assert.equal(args[0], 'onunload');
        assert.equal(args[1].name, 'flush');
      });
      
      const p1s1 = 'e+s9mnuVGDptGAJR3YICVyc7jCoecrtGKfoA7FqbzHa52OvI5+HF0jQqB91adunKQB9PTCsrlI5xnDaqcsWOx03LETsDsJV72bdn4q25AxRgveLuVDbvPu46cu6ZABMQExcthjK3jcLWELBCuTVGANxoI48Tea26uOvx2lTZknFRl3Ds+LHy/kRE/2p0QCl4HWap3zy4JzlsBx4M9vcOCjSXkAc8ziVjgdq1dx9qae0FS5EQiuzaU43VU9yg+Wgrfo6OXkoeaHGX3ABA+t+KXA2LeT3yr2Iniv9UMfKGEZAGvBFLlP006BXuaZfq2quREv1rMn9mhN+xINt08JWHPg==';
      const p1s2 = 'WZsMuHuVGDptGAJR3YICVyc7jCoecrtGKfoA7FqbzHa52OvI5+HF0jQqB91adunKQB9PTCsrlI5xnDaqcsWOx03LETsDsJV72bdn4q25AxRgveLuVDbvPu46cu6ZABMQExcthjK3jcLWELBCuTVGANxoI48Tea26uOvx2lTZknFRl3Ds+LHy/kRE/2p0QCl4HWap3zy4JzlsBx4M9vcOCjSXkAc8ziVjgdq1dx9qae0FS5EQiuzaU43VU9yg+Wgrfo6OXkoeaHGX3ABA+t+KXA2LeT3yr2Iniv9UMfKGEZAGvBFLlP006BXuaZfq2quREv1rMn9mhN+xINt08JWHPg==';
      const p2s1 = 'ZDAUvnKD5E4Zte3+xZ7xb+vNa77fAZGvCozPvDrnL5dIBCLiH+PAssB4wbj9VR9POR6BRZ93Za3H9LGLJwFZJ6KQoL+8CXILSeEOMUfDiNxagyWBkQn/DKzSYigwoKDZP3d8+/KlOCiI7iY4B5BJxCuX9we2DrQDGVpFuifeeKX/zNyIDcOFdLKQkzkEI3NpVmmdQtFRwoZbFdP70uxeuA+e/199lk/FmmaVVDiiTm9sdmLT5HpVSqOUGV+sqUrgWUDRC08LujTtp923Ds+f/Os41JAWy9fvww8Fr7OMcv1mZTPLakeBQq2cz72d+u2boxa2+Z5j4fiPBOp1jkw5gA==';
      const p2s2 = 'RkAmnHKD5E4Zte3+xZ7xb+vNa77fAZGvCozPvDrnL5dIBCLiH+PAssB4wbj9VR9POR6BRZ93Za3H9LGLJwFZJ6KQoL+8CXILSeEOMUfDiNxagyWBkQn/DKzSYigwoKDZP3d8+/KlOCiI7iY4B5BJxCuX9we2DrQDGVpFuifeeKX/zNyIDcOFdLKQkzkEI3NpVmmdQtFRwoZbFdP70uxeuA+e/199lk/FmmaVVDiiTm9sdmLT5HpVSqOUGV+sqUrgWUDRC08LujTtp923Ds+f/Os41JAWy9fvww8Fr7OMcv1mZTPLakeBQq2cz72d+u2boxa2+Z5j4fiPBOp1jkw5gA==';
      const data1 = {p1: p1s1, p2: p2s1};
      const data2 = {p1: p1s2, p2: p2s2};
      
      it('should load data given no whitelist', function () {
        delete config.volatile;
        window.name = JSON.stringify(data1);
        storage.setItem(key, JSON.stringify(data2));
        createSut();
        
        assert.deepEqual(sut.data, {p1: 'p1', p2: 'p2'});
      });
      
      it('should load data only whitelisted properties', function () {
        config.volatile = 'p1';
        window.name = JSON.stringify(data1);
        storage.setItem(key, JSON.stringify(data2));
        createSut();
        
        assert.deepEqual(sut.data, {p1: 'p1'});
      });
    });
    
    describe('#persist', function () {
      const data = {p1: 'p1', p2: 'p2'};
      
      it('should set data given no whitelist', function () {
        delete config.volatile;
        createSut();
        
        return sut.persist(data).then(() => {
          assert.deepEqual(sut.data, data);
        });
      });
      
      it('should set data given whitelist', function () {
        config.volatile = 'p1';
        createSut();
        
        return sut.persist(data).then(() => {
          assert.deepEqual(sut.data, {p1: 'p1'});
        });
      });
      
      it('should resolve undefined', function () {
        createSut();
        
        return sut.persist(data).then((result) => {
          assert.isUndefined(result);
        });
      });
    });
    
    describe('#restore', function () {
      it('should resolve data', function () {
        createSut();
        sut.data = {p1: 'p1', p2: 'p2'};
        
        return sut.restore().then((result) => {
          assert.deepEqual(result, {p1: 'p1', p2: 'p2'});
        });
      });
    });
    
    describe('#clear', function () {
      it('should clear data', function () {
        createSut();
        
        return sut.clear().then(() => {
          assert.deepEqual(sut.data, {});
        });
      });
    });
    
    describe('#flush', function () {
      const data = {p1: 'p1', p2: 'p2'};
      
      it('should not throw given localStorage is unavailable', function () {
        createSut();
        
        delete sut.window.localStorage;
        
        sut.flush();
      });
      
      it('should not throw given window is unavailable', function () {
        createSut();
        
        delete sut.window;
        
        sut.flush();
      });
      
      it('should store parts to storage and window.name', function () {
        createSut();
        
        sut.data = data;
        sut.flush();
        
        let value1 = JSON.parse(storage.getItem(sut.key));
        assert.sameMembers(Object.keys(value1), ['p1', 'p2']);
        assert.match(value1.p1, base64regex);
        assert.match(value1.p2, base64regex);
        
        let value2 = JSON.parse(window.name);
        assert.sameMembers(Object.keys(value2), ['p1', 'p2']);
        assert.match(value2.p1, base64regex);
        assert.match(value2.p2, base64regex);
        
        assert.notEqual(value1.p1, value2.p1);
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
    
    describe('flush on window unload', function () {
      it('should flush when window.unload is fired', function () {
        window.name = null;
        createSut();
        
        addEventListener.lastCall.args[1]();
        
        assert.notEqual(window.name, null);
      });
      
      it('should flush when window.onunload is fired', function () {
        window.name = null;
        delete window.addEventListener;
        createSut();
        
        attachEvent.lastCall.args[1]();
        
        assert.notEqual(window.name, null);
      });
    });
  }
)
;
