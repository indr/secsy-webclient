/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
// import Ember from 'ember';
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
    });
  }
);
