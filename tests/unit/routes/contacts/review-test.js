import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import fakes from './../../../fakes';
import simple from 'simple-mock';

describeModule('route:contacts/review', 'Unit | Route | contacts/review', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function () {
    let sut, model,
      session,
      send, transitionTo;
    
    beforeEach(function () {
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
        session.set('data.authenticated.sync_enabled', true);
      });
      
      it('should transition to contacts.view if session.sync_enabled !== true', function () {
        session.set('data.authenticated.sync_enabled', false);
        sut.afterModel(model);
        
        assert(transitionTo.called, 'expected transitionTo to be called');
        assert.deepEqual(transitionTo.lastCall.args, ['contacts.view', model]);
      });
      
      it('should not transition away if sync_enabled === true', function () {
        sut.afterModel(model);
        
        assert(!transitionTo.called, 'expected transitionTo not to be called');
      });
    });
  }
);
