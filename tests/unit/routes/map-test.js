import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import fakes from './../../fakes';
import simple from 'simple-mock';

const {
  ArrayProxy,
  FakeAddressbook
} = fakes;

describeModule('route:map', 'Unit | Route | MapRoute', {
    // Specify the other units that are required for this test.
    needs: ['service:intl']
  },
  function () {
    let addressbook, sut;
    
    beforeEach(function () {
      this.register('service:addressbook', FakeAddressbook);
      addressbook = Ember.getOwner(this).lookup('service:addressbook');
      
      sut = this.subject();
    });
    
    it('exists', function () {
      assert.ok(sut);
    });
    
    describe('#model()', function () {
      it('should return all uncached contacts from addressbook service', function () {
        var contacts = ArrayProxy.create([]);
        var findContacts = simple.mock(addressbook, 'findContacts').resolveWith(contacts);
        
        return sut.model().then((result) => {
          assert(findContacts.called, 'addressbook#findContacts() was not called');
          assert.deepEqual(findContacts.lastCall.arg, {cache: false});
          assert.equal(result, contacts);
        })
      });
    });
  }
);
