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
      exporter,
      send;
    
    beforeEach(function () {
      this.register('service:exporter', fakes.FakeExporter);
      exporter = Ember.getOwner(this).lookup('service:exporter');
      
      sut = this.subject();
      sut.set('controller', Ember.Object.create());
      model = fakes.FakeContact.create({name$: 'Hans, Meier'});
      sut.controller.set('model', model);
      send = simple.mock(sut, 'send').callOriginal();
    });
    
    it('exists', function () {
      assert(sut);
    });
    
    describe('action #downloadCard', function () {
      it('should window.saveAs a vcard as text/vcard', function () {
        let saveAs = simple.mock(sut, 'saveAs').returnWith(undefined);
        simple.mock(exporter, 'contactTovCard3').returnWith('BEGIN:VCARD...');
        
        sut.send('downloadCard', model);
        
        assert.isTrue(saveAs.called);
        
        assert.instanceOf(saveAs.lastCall.args[0], window.Blob);
        assert.equal(saveAs.lastCall.args[0].type, 'text/vcard:charset=utf-8');
        assert.equal(saveAs.lastCall.args[1], 'Hans_Meier.vcf');
      });
    });
  }
);
