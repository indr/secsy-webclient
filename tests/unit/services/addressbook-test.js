import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import fakes from './../../fakes';
import simple from 'simple-mock';

const {
  ArrayProxy,
  FakeContact,
  FakeStore
} = fakes;

describeModule('service:addressbook', 'Unit | Service | AddressbookService', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let store, sut;
    
    beforeEach(function () {
      this.register('service:store', FakeStore);
      store = Ember.getOwner(this).lookup('service:store');
      
      sut = this.subject();
      // TODO[investigate] I expect the sut/subject to be a fresh instance?
      sut.cache = {};
    });
    
    describe("#findContacts()", function () {
      let contacts, findAll;
      
      beforeEach(function () {
        contacts = ArrayProxy.create([]);
        findAll = simple.mock(store, 'findAll').resolveWith(contacts);
      });
      
      it('should delegate to stores findAll', function () {
        return sut.findContacts().then((result) => {
          assert(findAll.called, 'findAll() was not called');
          assert.equal(findAll.lastCall.args[0], 'contact');
          assert.equal(result, contacts);
        });
      });
      
      it('should cache findAll', function () {
        let result1;
        return sut.findContacts().then((result) => {
          result1 = result;
          return sut.findContacts();
        }).then((result2) => {
          assert(findAll.called, 'findAll() was not called');
          assert.equal(findAll.callCount, 1, 'findAll() was called more than once');
          assert.equal(result1, contacts);
          assert.equal(result2, contacts);
        });
      });
    });
    
    describe('#findContactBy', function () {
      let contact, contacts, findAll;
      
      beforeEach(function () {
        contact = FakeContact.create({key: 'value'});
        contacts = ArrayProxy.create([contact]);
        findAll = simple.mock(store, 'findAll').resolveWith(contacts);
      });
      
      it('should delegate to stores findAll and return contact', function () {
        return sut.findContactBy('key', 'value').then((result) => {
          assert(findAll.called, 'findAll was not called');
          assert.equal(result, contact);
        });
      });
      
      it('should cache findAll and return contact', function () {
        let result1;
        return sut.findContactBy('key', 'value').then((result) => {
          result1 = result;
          return sut.findContactBy('key', 'value');
        }).then((result2) => {
          assert(findAll.called, 'findAll() was not called');
          assert.equal(findAll.callCount, 1, 'findAll() was called more than once');
          assert.equal(result1, contact);
          assert.equal(result2, result1);
        });
      });
    });
  }
);
