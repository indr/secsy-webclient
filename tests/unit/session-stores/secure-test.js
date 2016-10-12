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

import ENV from 'secsy-webclient/config/environment';

describeModule('session-store:secure', 'Unit | Session store | secure', {},
  function () {
    let config, createSut, sut, persistentStore, volatileStore;
    
    beforeEach(function () {
      ENV['secure-store'] = config = {};
      createSut = function () {
        sut = this.subject();
        persistentStore = sut.get('_persistentStore');
        volatileStore = sut.get('_volatileStore');
        return sut;
      }.bind(this);
    });
    
    describe('#init', function () {
      it('should set persistent stores local storage key', function () {
        createSut();
        
        assert.equal(persistentStore.localStorageKey, 'ember_simple_auth:persistent');
      });
      
      it('should set persistent stores cookie name', function () {
        createSut();
        
        assert.equal(persistentStore.cookieName, 'ember_simple_auth:persistent');
      });
    });
    
    describe('#persist', function () {
      const data = {p: 'p1', v: 'v1', x: 'x1'};
      let persistentPersist, volatilePersist;
      
      it('should persist given no whitelists', function () {
        delete config.persistent;
        delete config.volatile;
        createSut();
        persistentPersist = simple.mock(persistentStore, 'persist').resolveWith();
        volatilePersist = simple.mock(volatileStore, 'persist').resolveWith();
        
        return sut.persist(data).then(() => {
          assert.deepEqual(persistentPersist.lastCall.arg, {});
          assert.deepEqual(volatilePersist.lastCall.arg, {p: 'p1', v: 'v1', x: 'x1'});
        });
      });
      
      it('should persist given only persistent whitelist', function () {
        config.persistent = 'p';
        delete config.volatile;
        createSut();
        persistentPersist = simple.mock(persistentStore, 'persist').resolveWith();
        volatilePersist = simple.mock(volatileStore, 'persist').resolveWith();
        
        return sut.persist(data).then(() => {
          assert.deepEqual(persistentPersist.lastCall.arg, {p: 'p1'});
          assert.deepEqual(volatilePersist.lastCall.arg, {v: 'v1', x: 'x1'});
        });
      });
      
      it('should persist given both whitelists ', function () {
        config.persistent = 'p';
        config.volatile = 'v';
        createSut();
        persistentPersist = simple.mock(persistentStore, 'persist').resolveWith();
        volatilePersist = simple.mock(volatileStore, 'persist').resolveWith();
        
        return sut.persist(data).then(() => {
          assert.deepEqual(persistentPersist.lastCall.arg, {p: 'p1'});
          assert.deepEqual(volatilePersist.lastCall.arg, {v: 'v1'});
        });
      });
      
      it('should resolve with undefined', function () {
        createSut();
        
        return sut.persist(data).then((result) => {
          assert.isUndefined(result);
        });
      });
      
      it('should reject with persistent stores error', function () {
        createSut();
        simple.mock(persistentStore, 'persist').rejectWith(new Error('persistent restore error'));
        simple.mock(volatileStore, 'persist').resolveWith({});
        
        return sut.persist(data).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'persistent restore error');
        });
      });
      
      it('should reject with volatile stores error', function () {
        createSut();
        simple.mock(persistentStore, 'persist').resolveWith({});
        simple.mock(volatileStore, 'persist').rejectWith(new Error('volatile restore error'));
        
        return sut.persist(data).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatile restore error');
        });
      });
    });
    
    describe('#restore', function () {
      const persistentData = {p: 'p1', v: 'v1', x: 'x1'};
      const volatileData = {p: 'p2', v: 'v2', x: 'x2'};
      
      let persistentRestore, volatileRestore;
      
      it('should resolve given no whitelists', function () {
        delete config.persistent;
        delete config.volatile;
        createSut();
        persistentRestore = simple.mock(persistentStore, 'restore').resolveWith(persistentData);
        volatileRestore = simple.mock(volatileStore, 'restore').resolveWith(volatileData);
        
        return sut.restore().then((data) => {
          assert.deepEqual(data, {p: 'p2', v: 'v2', x: 'x2'});
        });
      });
      
      it('should resolve given only persistent whitelist', function () {
        config.persistent = 'p';
        delete config.volatile;
        createSut();
        persistentRestore = simple.mock(persistentStore, 'restore').resolveWith(persistentData);
        volatileRestore = simple.mock(volatileStore, 'restore').resolveWith(volatileData);
        
        return sut.restore().then((data) => {
          assert.deepEqual(data, {p: 'p1', v: 'v2', x: 'x2'});
        });
      });
      
      it('should resolve given both whitelists ', function () {
        config.persistent = 'p';
        config.volatile = 'v';
        createSut();
        persistentRestore = simple.mock(persistentStore, 'restore').resolveWith(persistentData);
        volatileRestore = simple.mock(volatileStore, 'restore').resolveWith(volatileData);
        
        return sut.restore().then((data) => {
          assert.deepEqual(data, {p: 'p1', v: 'v2'});
        });
        
      });
      
      it('should reject with persistent stores error', function () {
        createSut();
        simple.mock(persistentStore, 'restore').rejectWith(new Error('persistent restore error'));
        simple.mock(volatileStore, 'restore').resolveWith({});
        
        return sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'persistent restore error');
        });
      });
      
      it('should reject with volatile stores error', function () {
        createSut();
        simple.mock(persistentStore, 'restore').resolveWith({});
        simple.mock(volatileStore, 'restore').rejectWith(new Error('volatile restore error'));
        
        return sut.restore().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatile restore error');
        });
      });
    });
    
    describe('#clear', function () {
      let persistentClear, volatileClear;
      
      beforeEach(function () {
        createSut();
        persistentClear = simple.mock(persistentStore, 'clear');
        volatileClear = simple.mock(volatileStore, 'clear');
      });
      
      it('should clear persistent and volatile store and return undefined', function () {
        persistentClear.resolveWith();
        volatileClear.resolveWith();
        
        return sut.clear().then((result) => {
          assert.isTrue(persistentClear.called);
          assert.isTrue(volatileClear.called);
          assert.isUndefined(result);
        });
      });
      
      it('should reject with persistent stores error', function () {
        persistentClear.rejectWith(new Error('persistent clear error'));
        volatileClear.resolveWith();
        
        return sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'persistent clear error');
        });
      });
      
      it('should reject with volatile stores error', function () {
        persistentClear.resolveWith();
        volatileClear.rejectWith(new Error('volatile clear error'));
        
        return sut.clear().then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'volatile clear error');
        });
      });
    });
    
    describe('event sessionDataUpdated', function () {
      beforeEach(function () {
        config.persistent = 'p';
        config.volatile = 'v';
        createSut();
        
        return sut.persist({p: 'p1', v: 'v1'});
      });
      
      it('should trigger if persistent store triggers', function (done) {
        sut.on('sessionDataUpdated', (data) => {
          assert.deepEqual(data, {p: 'p1', v: 'v1'});
          done();
        });
        
        persistentStore.trigger('sessionDataUpdated', {u: 'u1'});
      });
      
      it('should not trigger if volatile store triggers', function () {
        sut.on('sessionDataUpdated', () => {
          assert.fail('sessionDataUpdated was triggered');
        });
        
        volatileStore.trigger('sessionDataUpdated', {u: 'u1'});
      });
    });
  }
);
