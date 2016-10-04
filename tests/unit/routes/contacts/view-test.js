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

describeModule('route:contacts/view', 'Unit | Route | contacts/view', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function () {
    let sut, model,
      exporter, flashMessages,
      send;
    
    beforeEach(function () {
      this.register('service:exporter', fakes.FakeExporter);
      exporter = Ember.getOwner(this).lookup('service:exporter');
      this.register('service:flash-messages', fakes.FlashMessages);
      flashMessages = Ember.getOwner(this).lookup('service:flash-messages');
      
      sut = this.subject();
      sut.set('controller', Ember.Object.create());
      sut.set('flashMessages', flashMessages);
      model = fakes.FakeContact.create({name$: 'Hans, Meier'});
      sut.controller.set('model', model);
      sut.saveAs = Ember.K;
      send = simple.mock(sut, 'send').callOriginal();
    });
    
    describe('action #downloadCard', function () {
      it('should window.saveAs a vcard as text/vcard', function () {
        let saveAs = simple.mock(sut, 'saveAs').returnWith(undefined);
        simple.mock(exporter, 'toVcard').resolveWith('BEGIN:VCARD...');
        
        return sut.send('downloadCard', model).then(() => {
          assert.isTrue(saveAs.called);
          
          assert.instanceOf(saveAs.lastCall.args[0], window.Blob);
          assert.equal(saveAs.lastCall.args[0].size, 14);
          assert.equal(saveAs.lastCall.args[0].type, 'text/vcard:charset=utf-8');
          assert.equal(saveAs.lastCall.args[1], 'Hans_Meier.vcf');
        });
      });
      
      it('should flash error message', function () {
        const error = new Error('toVcard rejected');
        simple.mock(exporter, 'toVcard').rejectWith(error);
        let dangerT = simple.mock(flashMessages, 'dangerT').returnWith();
        
        return sut.send('downloadCard', model).then(() => {
          assert.isTrue(dangerT.called);
          assert.equal(dangerT.lastCall.args[0], 'errors.download-vcard-error');
          assert.equal(dangerT.lastCall.args[1], error);
        });
      });
    });
  }
);
