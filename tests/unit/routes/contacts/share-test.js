import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import fakes from './../../../fakes';
import simple from 'simple-mock';

describeModule('route:contacts/share', 'Unit | Route | contacts/share', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function () {
    let sut, model,
      updatePusher, flashMessages, session,
      send, transitionTo;
    
    beforeEach(function () {
      this.register('service:update-pusher', fakes.UpdatePusher);
      updatePusher = Ember.getOwner(this).lookup('service:update-pusher');
      this.register('service:flash-messages', fakes.FlashMessages);
      flashMessages = Ember.getOwner(this).lookup('service:flash-messages');
      this.register('service:session', fakes.Session);
      session = Ember.getOwner(this).lookup('service:session');
      
      sut = this.subject();
      sut.set('controller', Ember.Object.create());
      sut.track = fakes.track;
      model = fakes.FakeContact.create();
      sut.controller.set('model', model);
      send = simple.mock(sut, 'send').callOriginal();
      transitionTo = simple.mock(sut, 'transitionTo').returnWith();
    });
    
    describe('#afterModel', function () {
      beforeEach(function () {
        model.set('me', true);
        session.set('data.authenticated.sync_enabled', true);
      });
      
      it('should transition to contacts.view if contact.me !== true', function () {
        model.set('me', false);
        sut.afterModel(model);
        
        assert(transitionTo.called, 'expected transitionTo to be called');
        assert.equal(transitionTo.lastCall.args[0], 'contacts.view');
        assert.equal(transitionTo.lastCall.args[1], model);
      });
      
      it('should transition to contacts.view if session.sync_enabled !== true', function () {
        session.set('data.authenticated.sync_enabled', false);
        sut.afterModel(model);
        
        assert(transitionTo.called, 'expected transitionTo to be called');
        assert.equal(transitionTo.lastCall.args[0], 'contacts.view');
        assert.equal(transitionTo.lastCall.args[1], model);
      });
      
      it('should not transition away if contact.me === true && sync_enabled === true', function () {
        sut.afterModel(model);
        
        assert(!transitionTo.called, 'expected transitionTo not to be called');
      })
    });
    
    describe('action #cancel', function () {
      it('should transition to contacts.view', function () {
        
        sut.send('cancel');
        
        assert(transitionTo.called, 'expected transitionTo to be called');
        assert.equal(transitionTo.lastCall.args[0], 'contacts.view');
        assert.equal(transitionTo.lastCall.args[1], model);
      });
    });
    
    describe('action #share', function () {
      let data, emailAddress, push;
      
      beforeEach(function () {
        data = {};
        emailAddress = 'user@example.com';
        session.set('data.authenticated.email', emailAddress);
        push = simple.mock(updatePusher, 'push').resolveWith();
      });
      
      it('should call updatePusher.push with data and an onProgress callback', function () {
        return sut.send('share', data).then(() => {
          assert(push.called, 'expected pushser.push to be called');
          assert.equal(push.lastCall.args[0], data);
          assert.equal(push.lastCall.args[1], emailAddress);
          assert.isFunction(push.lastCall.args[2]);
        });
      });
      
      it('should call updatePusher.push with an onProgress callback that sends onProgress', function () {
        sut.send('share', data);
        const onProgress = push.lastCall.args[2];
        
        const status = {};
        onProgress(status);
        
        assert(send.called, 'expected send to be called');
        assert.equal(send.lastCall.args[0], 'onProgress');
        assert.equal(send.lastCall.args[1], status);
      });
      
      it('should transitions to contacts.view', function () {
        sut.send('share', data);
        
        assert(transitionTo.called, 'expected transitionTo to be called');
        var args = transitionTo.lastCall.args;
        assert.equal(args[0], 'contacts.view');
        assert.equal(args[1], model);
      });
      
      it('should flash message share.unknown-error given push rejects', function () {
        simple.mock(updatePusher, 'push').rejectWith(new Error('push rejected'));
        
        return sut.send('share', data).then(() => {
          const dangerT = flashMessages.dangerT;
          assert(dangerT.called, 'expected dangerT to be called');
          assert.equal(dangerT.lastCall.args[0], 'share.unknown-error');
          assert.equal(dangerT.lastCall.args[1].name, 'Error');
          assert.equal(dangerT.lastCall.args[1].message, 'push rejected');
        });
      });
      
      it('should flash message share.unknown-error given push throws', function () {
        simple.mock(updatePusher, 'push').throwWith(new Error('push threw'));
        
        sut.send('share', data);
        const dangerT = flashMessages.dangerT;
        assert(dangerT.called, 'expected dangerT to be called');
        assert.equal(dangerT.lastCall.args[0], 'share.unknown-error');
        assert.equal(dangerT.lastCall.args[1].name, 'Error');
        assert.equal(dangerT.lastCall.args[1].message, 'push threw');
      });
    });
  }
)
;
