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
import fakes from './../../fakes';
import simple from 'simple-mock';

describeModule('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    needs: [
      'service:intl',
      'service:keychain',
      'service:keystore',
      'service:openpgp']
  },
  function () {
    let register, sut,
      updatePuller, flashMessages, session;
    
    beforeEach(function () {
      function registerAndLookup (name, obj) {
        obj = obj || Ember.Object;
        this.register(name, obj);
        return Ember.getOwner(this).lookup(name);
      }
      
      register = registerAndLookup.bind(this);
    });
    
    beforeEach(function () {
      updatePuller = register('service:update-puller', fakes.UpdatePuller);
      flashMessages = register('service:flash-messages', fakes.FlashMessages);
      session = register('service:session', fakes.Session);
      session.set('data.authenticated.sync_enabled', true);
      
      sut = this.subject();
      sut.controller = Ember.Object.create({progress: {}});
      sut.track = function (prop, promise) {
        return promise ? promise : prop;
      };
    });
    
    describe('action#pullUpdates', function () {
      var emailAddress = 'user@example.com';
      
      beforeEach(function () {
        session.set('data.authenticated.email', emailAddress);
      });
      
      it('should not pull if enable_sync is false', function () {
        session.set('data.authenticated.sync_enabled', false);
        
        sut.send('pullUpdates');
        
        assert.isFalse(updatePuller.pull.called);
      });
      
      it('should call updatePuller.push with emailAddress and a onProgress callback', function () {
        updatePuller.pull.resolveWith();
        
        sut.send('pullUpdates');
        
        const call = updatePuller.pull.lastCall;
        assert(call, 'expected updatePuller.pull to be called');
        assert.equal(call.args[0], emailAddress);
        assert.isFunction(call.args[1]);
      });
      
      it('should call updatePuller.push with an onProgress callback that invokes sut.onProgress', function () {
        updatePuller.pull.resolveWith();
        sut.onProgress = simple.mock();
        
        return sut.send('pullUpdates').then(() => {
          const onProgress = updatePuller.pull.lastCall.args[1];
          const status = {};
          onProgress(status);
          
          assert(sut.onProgress.called, 'expected sut.onProgress to be called');
          const args = sut.onProgress.lastCall.args;
          assert.equal(args[0], status);
        });
      });
      
      it('should flash message pull-updates.unknown-error given pull rejects', function () {
        updatePuller.pull.rejectWith(new Error('pull rejected'));
        
        return sut.send('pullUpdates').then(() => {
          assert(flashMessages.dangerT.called, 'expected flashMessages.dangerT to be called');
          const call = flashMessages.dangerT.lastCall;
          assert.equal(call.args[0], 'pull-updates.unknown-error');
          assert.equal(call.args[1].name, 'Error');
          assert.equal(call.args[1].message, 'pull rejected');
        });
      });
      
      it('should flash message pull-updates.unknown-error given pull throws', function () {
        updatePuller.pull.throwWith(new Error('pull threw'));
        
        sut.send('pullUpdates');
        
        assert(flashMessages.dangerT.called, 'expected flashMessages.dangerT to be called');
        const call = flashMessages.dangerT.lastCall;
        assert.equal(call.args[0], 'pull-updates.unknown-error');
        assert.equal(call.args[1].name, 'Error');
        assert.equal(call.args[1].message, 'pull threw');
      })
    });
  }
);
