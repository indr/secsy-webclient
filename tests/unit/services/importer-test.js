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

import fakes from '../../fakes';

function genVcard(fns) {
  fns = Ember.isArray(fns) ? fns : new Array(fns);
  
  let result = [];
  for (var i = 0, l = fns.length; i < l; i++) {
    result.push(`BEGIN:VCARD
VERSION:3.0
FN:${fns[i]}
N:Muster Tester;Hans;Peter;;
EMAIL:hans@example.com
GEO:-7.27,46.57
NOTE:Personal\\n multiline\\n notes
TEL:+891234567
URL:www.example.com
X-SKYPE:@skyHans
X-TELEGRAM:@teleHans
X-WHATSAPP:@whatsHans
X-LOCATION-NAME:Bern
END:VCARD `);
  }
  return result.join('\n');
}

describeModule('service:importer', 'Unit | Service | ImporterService', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
      sut.fileReader = fakes.FileReader.create();
      sut.store = fakes.FakeStore.create();
    });
    
    describe('#import', function () {
      const fileList = [{}];
      const files = [{ result: genVcard(['First', 'Second']) }, { result: genVcard('Third') }];
      
      beforeEach(function () {
      });
      
      it('should create and save contacts, resolve with undefined', function () {
        simple.mock(sut.fileReader, 'importFiles').resolveWith(files);
        const contact = fakes.FakeContact.create();
        simple.mock(contact, 'save').resolveWith();
        const createRecord = simple.mock(sut.store, 'createRecord').returnWith(contact);
        
        return sut.import(fileList).catch(() => assert.fail()).then((result) => {
          assert.isUndefined(result);
          
          assert.isTrue(createRecord.called);
          assert.deepEqual(createRecord.calls[0].args[1], {
            name$: 'Third',
            emailAddress$: 'hans@example.com',
            contact_phoneNumber$: '+891234567',
            contact_website$: 'www.example.com',
            location_name$: 'Bern',
            location_latitude$: -7.27,
            location_longitude$: 46.57,
            internet_skype$: '@skyHans',
            internet_telegram$: '@teleHans',
            internet_whatsapp$: '@whatsHans'
          });
          assert.equal(createRecord.calls[1].args[1].name$, 'Second');
          assert.equal(createRecord.calls[2].args[1].name$, 'First');
        });
      });
    });
    
    describe('#parse', function () {
      it('should return array of vcards', function () {
        let actual = sut.parse(genVcard('fn1'));
        assert.equal(actual.length, 1);
        
        actual = sut.parse(genVcard(['fn1', 'fn2']));
        assert.equal(actual.length, 2);
      });
    });
  }
);
