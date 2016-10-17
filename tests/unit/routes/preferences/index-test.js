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
import fakes from '../../../fakes';
import simple from 'simple-mock';

describeModule('route:preferences/index', 'Unit | Route | preferences/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function () {
    let sut,
      addressbook, exporter, flashMessages;
    
    beforeEach(function () {
      this.register('service:addressbook', Ember.Object);
      addressbook = Ember.getOwner(this).lookup('service:addressbook');
      this.register('service:exporter', fakes.FakeExporter);
      exporter = Ember.getOwner(this).lookup('service:exporter');
      this.register('service:flash-messages', fakes.FlashMessages);
      flashMessages = Ember.getOwner(this).lookup('service:flash-messages');
      
      sut = this.subject();
      sut.set('controller', Ember.Object.create());
      sut.set('flashMessages', flashMessages);
      sut.saveAs = Ember.K;
    });
    
    describe('action #exportContacts', function () {
      it('should window.saveAs vcards as text/vcard', function () {
        let saveAs = simple.mock(sut, 'saveAs').returnWith();
        simple.mock(addressbook, 'findContacts').resolveWith(Ember.A());
        let toVcards = simple.mock(exporter, 'toVcards').resolveWith('BEGIN:VCARD...');
        
        return sut.send('exportContacts').then(() => {
          assert.isTrue(toVcards.called);
          assert.isTrue(saveAs.called);
          
          assert.instanceOf(saveAs.lastCall.args[0], window.Blob);
          assert.equal(saveAs.lastCall.args[0].size, 14);
          assert.equal(saveAs.lastCall.args[0].type, 'text/vcard:charset=utf-8');
          assert.equal(saveAs.lastCall.args[1], 'secsy-contacts.vcf');
        });
      });
      
      it('should flash error message given addressbook findContacts rejects', function () {
        const error = new Error('findContacts rejected');
        simple.mock(addressbook, 'findContacts').rejectWith(error);
        let dangerT = simple.mock(flashMessages, 'dangerT').returnWith();
        
        return sut.send('exportContacts').then(() => {
          assert.isTrue(dangerT.called);
          assert.equal(dangerT.lastCall.args[0], 'errors.download-vcard-error');
          assert.equal(dangerT.lastCall.args[1], error);
        });
      });
      
      it('should flash error message given exporter toVcards rejects', function () {
        simple.mock(addressbook, 'findContacts').resolveWith(Ember.A());
        const error = new Error('toVcards rejected');
        simple.mock(exporter, 'toVcards').rejectWith(error);
        let dangerT = simple.mock(flashMessages, 'dangerT').returnWith();
        
        return sut.send('exportContacts').then(() => {
          assert.isTrue(dangerT.called);
          assert.equal(dangerT.lastCall.args[0], 'errors.download-vcard-error');
          assert.equal(dangerT.lastCall.args[1], error);
        });
      });
    });
  }
);
