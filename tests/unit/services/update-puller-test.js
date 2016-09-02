import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha'
import simple from 'simple-mock'
import fakes from './../../fakes'

const {
  RSVP
} = Ember;


const {
  ArrayProxy,
  FakeAddressbook,
  FakeContact,
  FakeCrypto,
  FakeStore,
  FakeUpdate,
  RecordArray
} = fakes;

describeModule('service:update-puller', 'Unit | Service | UpdatePullerService', {
    // Specify the other units that are required for this test.
    needs: ['service:intl']
  },
  function () {
    let addressbook, crypto, store,
      sut, options;
    
    function makeUpdate () {
      return FakeUpdate.create();
    }
    
    function makeUpdates (number) {
      var updates = [];
      while (number--) {
        updates.push(makeUpdate())
      }
      return ArrayProxy.create(updates);
    }
    
    beforeEach(function () {
      this.register('service:store', FakeStore);
      store = Ember.getOwner(this).lookup('service:store');
      this.register('service:addressbook', FakeAddressbook);
      addressbook = Ember.getOwner(this).lookup('service:addressbook');
      this.register('service:crypto', FakeCrypto);
      crypto = Ember.getOwner(this).lookup('service:crypto');
      
      sut = this.subject();
      options = {
        onProgress: Ember.K,
        status: {done: null, max: null, value: null}
      };
    });
    
    describe('#pull', function () {
      let emailAddress, onProgress, options,
        findUpdates, processUpdates;
      
      beforeEach(function () {
        emailAddress = 'user@example.com';
        onProgress = simple.spy(Ember.K);
        
        findUpdates = simple.mock(sut, 'findUpdates').callFn(function () {
          options = arguments[0];
          options.updates = makeUpdates(5).toArray();
          options.status.max = options.updates.length;
          return RSVP.resolve(options);
        });
        
        processUpdates = simple.mock(sut, 'processUpdates').callFn(function () {
          options = arguments[0];
          return RSVP.resolve(options);
        });
      });
      
      it('should call find updates with constructed options object', function () {
        return sut.pull(emailAddress, onProgress).then(() => {
          assert(findUpdates.called, 'expected findUpdates to be called');
          var arg = findUpdates.lastCall.arg;
          assert.equal(arg.emailHash, crypto.hashEmail('user@example.com'));
          assert.equal(arg.onProgress, onProgress);
        });
      });
      
      it('should call processUpdates', function () {
        return sut.pull(emailAddress, onProgress).then(() => {
          assert(processUpdates.called, 'expected processUpdates to be called');
        });
      });
      
      it('should progress with status.max', function () {
        return sut.pull(emailAddress, onProgress).then(() => {
          assert(onProgress.called, 'expected onProgress to be called');
          const status = onProgress.calls[0].arg;
          assert.deepEqual(status, {done: false, max: 5, value: 0});
        });
      });
      
      it('should progress with done:true and return options', function () {
        return sut.pull(emailAddress, onProgress).then((result) => {
          assert(onProgress.called, 'expected onProgress to be called');
          const status = onProgress.lastCall.args[0];
          assert.deepEqual(status, {done: true, max: 5, value: 0});
          assert.equal(result, options);
        });
      });
      
      it('should progress with done:true and throw error', function (done) {
        var error = new Error('findUpdates threw error');
        simple.mock(sut, 'findUpdates').throwWith(error);
        
        sut.pull(emailAddress, onProgress).catch((err) => {
          assert.equal(err, error);
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
    
    describe('#findUpdates', function () {
      let query;
      
      beforeEach(function () {
        options.emailHash = 'abc123';
        query = simple.mock(store, 'query').resolveWith(RecordArray.create([
          FakeUpdate.create(), FakeUpdate.create(), FakeUpdate.create()
        ]));
      });
      
      it('should ask store to query for updates with given hash', function () {
        return sut.findUpdates(options).then(() => {
          assert.equal(query.lastCall.args[0], 'update');
          assert.deepEqual(query.lastCall.args[1], {emailSha256: 'abc123'});
        })
      });
      
      it('should resolve options object with options.updates and options.status.max', function () {
        return sut.findUpdates(options).then((result) => {
          assert.equal(result, options);
          assert.isArray(options.updates);
          assert.equal(options.status.max, 3);
        })
      })
    });
    
    describe('#processUpdates', function () {
      it('should call processUpdate for each update and return options', function () {
        var processUpdate = simple.mock(sut, 'processUpdate').resolveWith(options);
        options.updates = makeUpdates(3).toArray();
        var updates = options.updates.toArray().reverse();
        
        return sut.processUpdates(options).then((result) => {
          assert.equal(processUpdate.callCount, 3);
          for (var i = processUpdate.callCount - 1; i >= 0; i--) {
            assert.equal(processUpdate.calls[i].args[0], options);
            assert.equal(processUpdate.calls[i].args[1], updates[i]);
          }
          assert.equal(result, options);
        });
      });
      
      it('should continue given processUpdate rejects', function () {
        simple.mock(sut, 'processUpdate').rejectWith(new Error('processUpdate() rejected'));
        options.updates = makeUpdates(3).toArray();
        
        return sut.processUpdates(options);
      });
      
      it('should increment status and fire progress when processUpdate resolves', function () {
        options.status = {value: 0};
        simple.mock(sut, 'processUpdate').resolveWith(options);
        var fireProgress = simple.mock(sut, 'fireProgress').resolveWith(options);
        options.updates = makeUpdates(3).toArray();
        
        return sut.processUpdates(options).then(() => {
          assert(fireProgress.called, 'expected fireProgress to be called');
          assert.equal(fireProgress.callCount, 3);
          assert.equal(options.status.value, 3);
        })
      });
      
      it('should increment status and fire progress when processUpdate rejects', function () {
        options.status = {value: 0};
        simple.mock(sut, 'processUpdate').rejectWith(new Error('processUpdate() rejected'));
        var fireProgress = simple.mock(sut, 'fireProgress').resolveWith(options);
        options.updates = makeUpdates(3).toArray();
        
        return sut.processUpdates(options).then(() => {
          assert(fireProgress.called, 'expected fireProgress to be called');
          assert.equal(fireProgress.callCount, 3);
          assert.equal(options.status.value, 3);
        })
      });
    });
    
    describe('#processUpdate', function () {
      let update, destroyRecord;
      
      beforeEach(function () {
        update = makeUpdate();
        destroyRecord = simple.mock(update, 'destroyRecord');
      });
      
      it('should decrypt, decode, validate and pushToContact', function () {
        var decrypt = simple.mock(sut, 'decrypt').resolveWith(options);
        var decode = simple.mock(sut, 'decode').resolveWith(options);
        var validate = simple.mock(sut, 'validate').returnWith(options);
        var pushToContact = simple.mock(sut, 'pushToContact').returnWith(options);
        
        return sut.processUpdate(options, update).then((result) => {
          assert(decrypt.called);
          assert(decode.called);
          assert(validate.called);
          assert(pushToContact.called);
          assert.equal(result, options);
        });
      });
      
      const steps = ['decrypt', 'decode', 'validate', 'pushToContact'];
      
      function mockSteps (sut) {
        steps.forEach((each) => {
          simple.mock(sut, each).resolveWith(options);
        })
      }
      
      it('should destroy contact if decrypt throws and reject with Error', function () {
        mockSteps(sut);
        simple.mock(sut, 'decrypt').rejectWith(new Error('decrypt rejected'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroyRecord.called, 'expected update.destroyRecord to be called');
          assert.equal(err.message, 'decrypt rejected');
        });
      });
      
      it('should destroy contact if decode throws and reject with Error', function () {
        mockSteps(sut);
        simple.mock(sut, 'decode').rejectWith(new Error('decode rejected'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroyRecord.called, 'expected update.destroyRecord to be called');
          assert.equal(err.message, 'decode rejected');
        });
      });
      
      it('should destroy contact if validate throws and reject with Error', function () {
        mockSteps(sut);
        simple.mock(sut, 'validate').rejectWith(new Error('validate rejected'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroyRecord.called, 'expected update.destroyRecord to be called');
          assert.equal(err.message, 'validate rejected');
        });
      });
      
      it('should destroy contact if pushToContact throws and reject with Error', function () {
        mockSteps(sut);
        simple.mock(sut, 'pushToContact').rejectWith(new Error('pushToContact rejected'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroyRecord.called, 'expected update.destroyRecord to be called');
          assert.equal(err.message, 'pushToContact rejected');
        });
      });
    });
    
    describe('#decrypt', function () {
      it('should ask crypto to decrypt', function () {
        var decrypt = simple.mock(crypto, 'decrypt').resolveWith({base64: 'decrypted'});
        var update = options.update = makeUpdate();
        update.encrypted_ = 'cypher';
        
        return sut.decrypt(options).then((result) => {
          assert(decrypt.called);
          assert.equal(decrypt.lastCall.arg, 'cypher');
          assert.equal(update.decrypted, 'decrypted');
          assert.equal(result, options);
        });
      });
    });
    
    describe('#decode', function () {
      it('should ask crypto to decode', function () {
        var decode = simple.mock(crypto, 'decodeBase64').resolveWith({emailAddress$: 'user@example.com'});
        var update = options.update = makeUpdate();
        update.decrypted = 'base64';
        
        return sut.decode(options).then((result) => {
          assert(decode.called);
          assert.equal(decode.lastCall.arg, 'base64');
          assert.equal(result, options);
        });
      });
    });
    
    describe('#validate', function () {
      it('should resolve with options given validation succeeds', function () {
        var update = options.update = makeUpdate();
        update.from_email_sha256 = crypto.hashEmail('user@example.com');
        update.decoded = {emailAddress$: 'user@example.com'};
        
        var result = sut.validate(options);
        assert.equal(result, options);
      });
      
      it('should throw No decoded email address', function () {
        var update = options.update = makeUpdate();
        update.decoded = {};
        
        assert.throws(sut.validate.bind(sut, options), /No decoded email address/);
      });
      
      it('should throw Invalid email hash', function () {
        simple.mock(crypto, 'hashEmail').returnWith('hashed');
        var update = options.update = makeUpdate();
        update.from_email_sha256 = 'wrong hash';
        update.decoded = {emailAddress$: 'user@example.com'};
        
        assert.throws(sut.validate.bind(sut, options), /Invalid email hash/);
      })
    });
    
    describe('#pushToContact', function () {
      it('should push to found contact', function () {
        var contact = FakeContact.create();
        simple.mock(sut, 'findContact').resolveWith(contact);
        var pushUpdate = simple.mock(contact, 'pushUpdate');
        var update = options.update = makeUpdate();
        update.decoded = {emailAddress$: 'user@example.com'};
        
        return sut.pushToContact(options).then((result) => {
          assert(pushUpdate.called);
          assert.equal(pushUpdate.lastCall.arg, update);
          assert.equal(result, options);
        })
      });
      
      it('should throw Contact not found', function () {
        simple.mock(sut, 'findContact').resolveWith(undefined);
        var update = options.update = makeUpdate();
        update.decoded = {emailAddress$: 'unknown@example.com'};
        
        return sut.pushToContact(options).then(() => {
          assert.fail(false, 'not rejected');
        }).catch((err) => {
          assert.match(err.message, /Contact not found/);
        });
      });
    });
    
    describe('#findContact', function () {
      beforeEach(function () {
      });
      
      it('should return undefined if contact could not be found', function () {
        var findContactBy = simple.mock(addressbook, 'findContactBy').resolveWith(undefined);
        
        return sut.findContact('unknown@example.com').then((result) => {
          assert(findContactBy.called, 'expected addressbook.findContactBy to be called');
          assert.equal(findContactBy.lastCall.args[0], 'emailAddress$');
          assert.equal(findContactBy.lastCall.args[1], 'unknown@example.com');
          assert.isUndefined(result);
        });
      });
      
      it('should return contact', function () {
        var contact = FakeContact.create({
          emailAddress$: 'user@example.com'
        });
        simple.mock(addressbook, 'findContactBy').resolveWith(contact);
        
        return sut.findContact('user@example.com').then((result) => {
          assert.isDefined(result);
          assert.equal(result, contact);
        });
      });
    });
  }
);
