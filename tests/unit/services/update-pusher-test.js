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
import fakes from './../../fakes';

const {
  ArrayProxy,
  FakeContact,
  FakeKey
} = fakes;

const {
  RSVP
} = Ember;

describeModule('service:update-pusher', 'Unit | Service | UpdatePusherService', {
    // Specify the other units that are required for this test.
    needs: ['service:intl']
  },
  function () {
    let addressbook, crypto, keystore, openpgp, store,
      sut, options;
    
    function makeContacts (number) {
      var contacts = [];
      while (number--) {
        contacts.push(FakeContact.create());
      }
      return ArrayProxy.create(contacts);
    }
    
    beforeEach(function () {
      this.register('service:store', fakes.FakeStore);
      store = Ember.getOwner(this).lookup('service:store');
      this.register('service:addressbook', fakes.FakeAddressbook);
      addressbook = Ember.getOwner(this).lookup('service:addressbook');
      this.register('service:crypto', fakes.FakeCrypto);
      crypto = Ember.getOwner(this).lookup('service:crypto');
      this.register('service:keystore', fakes.FakeKeystore);
      keystore = Ember.getOwner(this).lookup('service:keystore');
      this.register('service:openpgp', fakes.FakeOpenpgp);
      openpgp = Ember.getOwner(this).lookup('service:openpgp');
      
      sut = this.subject();
      options = {
        onProgress: Ember.K,
        status: {done: null, max: null, value: null}
      }
    });
    
    describe('#push', function () {
      let data, emailAddress, onProgress, options,
        encodePayload, loadContacts, processContacts;
      
      beforeEach(function () {
        data = {internet_telegram$: 'user@example.com'};
        emailAddress = 'user@example.com';
        onProgress = simple.spy(Ember.K);
        
        encodePayload = simple.mock(sut, 'encodePayload').callFn(function () {
          options = arguments[0];
          return RSVP.resolve(options);
        });
        
        loadContacts = simple.mock(sut, 'loadContacts').callFn(function () {
          options = arguments[0];
          options.contacts = makeContacts(3).toArray();
          options.status.max = options.contacts.length;
          return RSVP.resolve(options);
        });
        
        processContacts = simple.mock(sut, 'processContacts').callFn(function () {
          options = arguments[0];
          return RSVP.resolve(options);
        });
      });
      
      it('should throw if data is not an object that contains emailAddress$ key', function () {
        assert.throws(sut.push.bind(sut, {}),
          /You must provide at least one property/);
        assert.throws(sut.push.bind(sut, {randomKey: 'randomValue'}),
          /Data properties must match letters, underscore and/);
        assert.throws(sut.push.bind(sut, data, ''),
          /A valid email address must be provided/);
      });
      
      it('should call encodePayload with constructed options object', function () {
        return sut.push(data, emailAddress, onProgress).then(() => {
          assert(encodePayload.called, 'expected encodePayload to be called');
          const options = encodePayload.lastCall.arg;
          assert.equal(options.payload, data);
          assert.equal(options.onProgress, onProgress);
        })
      });
      
      it('should call loadContacts', function () {
        return sut.push(data, emailAddress, onProgress).then(() => {
          assert(loadContacts.called, 'expected loadContacts to be called');
        });
      });
      
      it('should call processContacts', function () {
        return sut.push(data, emailAddress, onProgress).then(() => {
          assert(processContacts.called, 'expected processContacts to be called');
        });
      });
      
      it('should progress with status.max', function () {
        return sut.push(data, emailAddress, onProgress).then(() => {
          assert(onProgress.called, 'expected onProgress to be called');
          const status = onProgress.calls[0].arg;
          assert.match(status.id, /^[a-z]+[0-9]+$/i);
          assert.deepEqual(status, {id: status.id, done: false, max: 3, value: 0});
        });
      });
      
      it('should progress with done:true and return options', function () {
        return sut.push(data, emailAddress, onProgress).then((result) => {
          assert(onProgress.called, 'expected onProgress to be called');
          const status = onProgress.lastCall.arg;
          assert.match(status.id, /^[a-z]+[0-9]+$/i);
          assert.deepEqual(status, {id: status.id, done: true, max: 3, value: 0});
          assert.equal(result, options);
        });
      });
      
      it('should progress with done:true and throw error', function (done) {
        var expected = new Error('encodePayload threw error');
        simple.mock(sut, 'encodePayload').throwWith(expected);
        
        sut.push(data, emailAddress, onProgress).catch((error) => {
          assert.equal(error, expected);
          assert(onProgress.called, 'expected onProgress to be called');
          const status = onProgress.lastCall.arg;
          assert.isTrue(status.done);
          done();
        });
      });
    });
    
    describe('#fireProgress', function () {
      it('should call options.onProgress with a copy of status and return options', function () {
        var onProgress = options.onProgress = simple.spy(Ember.K);
        
        var result = sut.fireProgress(options);
        assert(onProgress.called);
        assert.notEqual(onProgress.lastCall.arg, options.status);
        assert.deepEqual(onProgress.lastCall.arg, options.status);
        assert.equal(result, options);
      });
    });
    
    describe('#encodePayload', function () {
      it('should resolve options and set encoded options.payload', function () {
        options.payload = 'unencoded';
        return sut.encodePayload(options).then((result) => {
          assert.isString(options.payload, 'options.payload is not a string');
          assert.match(options.payload, /=$/);
          assert.equal(result, options);
        });
      });
    });
    
    describe('#loadContacts', function () {
      beforeEach(function () {
        simple.mock(addressbook, 'findContacts').resolveWith(ArrayProxy.create([
          FakeContact.create(), FakeContact.create({emailAddress$: 'a'}),
          FakeContact.create({emailAddress$: 'b'}), FakeContact.create()
        ]));
        delete options.contacts;
        delete options.status.max;
      });
      
      it('should load contacts with an emailAddress$ property', function () {
        return sut.loadContacts(options).then(() => {
          assert.isDefined(options.contacts);
          assert.lengthOf(options.contacts, 2);
        });
      });
      
      it('should resolve options and set options.status.max', function () {
        return sut.loadContacts(options).then((result) => {
          assert.equal(result, options);
          assert.equal(options.status.max, 2);
        });
      })
    });
    
    describe('#processContacts', function () {
      it('should call processContact for each contact', function () {
        var processContact = simple.mock(sut, 'processContact').resolveWith(options);
        options.contacts = makeContacts(3).toArray();
        var contacts = options.contacts.toArray().reverse();
        
        return sut.processContacts(options).then((result) => {
          assert.equal(processContact.callCount, 3);
          for (var i = processContact.callCount - 1; i >= 0; i--) {
            assert.equal(processContact.calls[i].args[0], options);
            assert.equal(processContact.calls[i].args[1], contacts[i]);
          }
          assert.equal(result, options);
        });
      });
      
      it('should continue given processContact rejects', function () {
        simple.mock(sut, 'processContact').rejectWith(new Error('processContact() rejected'));
        options.contacts = makeContacts(3).toArray();
        
        return sut.processContacts(options);
      });
      
      it('should increment status and fire progress when processContact resolves', function () {
        options.status = {value: 0};
        simple.mock(sut, 'processContact').resolveWith(options);
        var fireProgress = simple.mock(sut, 'fireProgress').resolveWith(options);
        options.contacts = makeContacts(3).toArray();
        
        return sut.processContacts(options).then(() => {
          assert(fireProgress.called, 'expected fireProgress to be called');
          assert.equal(fireProgress.callCount, 3);
          assert.equal(options.status.value, 3);
        });
      });
      
      it('should increment status and fire progress when processContact rejects', function () {
        options.status = {value: 0};
        simple.mock(sut, 'processContact').rejectWith(new Error('processContact() rejected'));
        var fireProgress = simple.mock(sut, 'fireProgress').resolveWith(options);
        options.contacts = makeContacts(3).toArray();
        
        return sut.processContacts(options).then(() => {
          assert(fireProgress.called, 'expected fireProgress to be called');
          assert.equal(fireProgress.callCount, 3);
          assert.equal(options.status.value, 3);
        });
      });
    });
    
    describe('#processContact', function () {
      let contact, getKey, encryptPayload, createUpdate;
      
      beforeEach(function () {
        contact = FakeContact.create({emailAddress$: 'user@example.com'});
        getKey = simple.mock(sut, 'getKey').resolveWith(options);
        encryptPayload = simple.mock(sut, 'encryptPayload').resolveWith(options);
        createUpdate = simple.mock(sut, 'createUpdate').resolveWith(options);
      });
      
      it('should getKey, encryptPayload and createUpdate', function () {
        return sut.processContact(options, contact).then(() => {
          assert(getKey.called, 'expected getKey to be called');
          assert(encryptPayload.called, 'encryptPayload to be called');
          assert(createUpdate.called, 'createUpdate to be called');
        });
      });
      
      it('should set options.contact and return options', function () {
        return sut.processContact(options, contact).then((result) => {
          assert.equal(options.contact, contact);
          assert.equal(result, options);
        });
      });
    });
    
    describe('#getKey', function () {
      let key, getPublicKey, readArmored, contact;
      
      beforeEach(function () {
        key = FakeKey.create({emailSha256: 'email hash'});
        getPublicKey = simple.mock(keystore, 'getPublicKey').resolveWith(key);
        readArmored = simple.mock(openpgp.key, 'readArmored').returnWith({keys: ['openpgp key']});
        contact = options.contact = FakeContact.create({emailAddress$: 'user@example.com'});
      });
      
      it('should ask keystore for publicKey of contacts emailAddress$', function () {
        return sut.getKey(options).then(() => {
          assert(getPublicKey.called, 'expected keystore.getPublicKey to be called');
          assert.equal(getPublicKey.lastCall.arg, contact.emailAddress$);
        });
      });
      
      it('should throw error if contact does not have a public key', function (done) {
        simple.mock(keystore, 'getPublicKey').resolveWith(undefined);
        
        sut.getKey(options).catch((error) => {
          assert.instanceOf(error, Error);
          assert.match(error.message, /Public key not found/);
          done();
        });
      });
      
      it('should set options.key.hash and return options', function () {
        return sut.getKey(options).then((result) => {
          assert.equal(options.key.hash, 'email hash');
          assert.equal(result, options);
        });
      });
      
      it('should readArmored and set options.key.pgp', function () {
        return sut.getKey(options).then(() => {
          assert(readArmored.called, 'expected openpgp.key.readArmored to be called');
          assert.isDefined(options.key.pgpKey);
          assert.equal(options.key.pgpKey, 'openpgp key');
        });
      });
    });
    
    describe('#encryptPayload', function () {
      let encrypt, payload, pgpKey;
      
      beforeEach(function () {
        encrypt = simple.mock(crypto, 'encrypt').resolveWith('encrypted');
        payload = options.payload = 'base64 encoded payload';
        pgpKey = 'openpgp key';
        options.key = {pgpKey};
      });
      
      it('should ask crypto to encrypt', function () {
        return sut.encryptPayload(options).then(() => {
          assert(encrypt.called, 'expected crypto.encrypt to be called');
          assert.equal(encrypt.lastCall.args[0], payload);
          assert.equal(encrypt.lastCall.args[1], pgpKey);
        });
      });
      
      it('should set options.encrypted and return options', function () {
        delete options.encrypted;
        
        return sut.encryptPayload(options).then((result) => {
          assert.isDefined(options.encrypted);
          assert.equal(result, options);
        });
      });
    });
    
    describe('#createUpdate', function () {
      let createRecord, save, update, encrypted, key;
      
      beforeEach(function () {
        store.createRecord = function (modelName, inputProperties) {
          update = fakes.FakeUpdate.create(inputProperties);
          save = simple.mock(update, 'save').resolveWith();
          return update;
        };
        createRecord = simple.mock(store, 'createRecord');
        
        encrypted = options.encrypted = 'encrypted payload';
        key = options.key = {
          hash: 'email hash'
        };
      });
      
      it('should ask store to create a record', function () {
        return sut.createUpdate(options).then(() => {
          assert(createRecord.called, 'expected store.createRecord to be called');
          assert.equal(createRecord.lastCall.args[0], 'update');
        });
      });
      
      it('should save update with toEmailSha256 and encrypted_', function () {
        return sut.createUpdate(options).then(() => {
          assert(save.called, 'expected record.save to be called');
          assert.equal(update.toEmailSha256, 'email hash');
          assert.equal(update.encrypted_, encrypted);
        });
      });
      
      it('should return options', function () {
        return sut.createUpdate(options).then((result) => {
          assert.equal(result, options);
        });
      })
    });
  }
);
