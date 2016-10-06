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

import { FakeContact } from '../../fakes';

describeModule('service:exporter', 'Unit | Service | ExporterService', {
    // Specify the other units that are required for this test.
    // needs: ['service:store']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
    });
    
    describe('#toVcard', function () {
      it('should not fail if contact has undefined values', function () {
        let contact = FakeContact.create();
        contact.name$ = 'Name';
        contact.emailAddress$ = 'test@example.com';
        
        return sut.toVcard(contact);
      });
      
      it('should return a full vcard', function () {
        let contact = FakeContact.create();
        contact.name$ = 'Hans Peter Muster Tester';
        contact.emailAddress$ = 'hans@example.com';
        contact.contact_phoneNumber$ = '+891234567';
        contact.contact_website$ = 'www.example.com';
        contact.contact_notes$ = 'Personal\n multiline\n notes';
        contact.location_name$ = 'Bern';
        contact.location_latitude$ = -7.27;
        contact.location_longitude$ = 46.57;
        contact.internet_skype$ = '@skyHans';
        contact.internet_telegram$ = '@teleHans';
        contact.internet_whatsapp$ = '@whatsHans';
        
        return sut.toVcard(contact).then((actual) => {
          const expected = `BEGIN:VCARD
VERSION:3.0
FN:Hans Peter Muster Tester
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
END:VCARD`.split('\n');
          
          actual = actual.split('\r\n');
          for (var i = 0; i < expected.length; i++) {
            assert.include(actual, expected[i], actual);
          }
          assert.sameDeepMembers(actual, expected);
        });
      });
    });
    
    describe('#toVcards', function () {
      it('should return vcards in a single string', function () {
        const contacts = Ember.A();
        contacts.pushObject(FakeContact.create({name$: 'One'}));
        contacts.pushObject(FakeContact.create({name$: 'Two'}));
        contacts.pushObject(FakeContact.create({name$: 'Three'}));
        
        return sut.toVcards(contacts).then((result) => {
          assert.match(result, /^BEGIN\:VCARD/);
          assert.match(result, /END:VCARD$/);
          assert.equal(result.match(/BEGIN:VCARD/g).length, 3);
          assert.match(result, /One/);
          assert.match(result, /Two/);
          assert.match(result, /Three/);
        });
      });
    });
  }
);
