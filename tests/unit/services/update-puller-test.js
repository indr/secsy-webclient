import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha'
import RecordArray from 'ember-data/-private/system/record-arrays/record-array'
import simple from 'simple-mock'

const {
  RSVP
} = Ember;

describeModule('service:update-puller', 'Unit | Service | UpdatePullerService', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let store, crypto,
      sut, options;
    
    const FakeStore = Ember.Object.extend({
      query: RSVP.resolve
    });
    
    const FakeCrypto = Ember.Object.extend({
      decrypt: RSVP.resolve.bind(null, {base64: ''}),
      decodeBase64: RSVP.resolve.bind(null, {}),
      hashEmail: function () {
        return 'default hash';
      }
    });
    const FakeContact = Ember.Object.extend({
      getRecord(){
        return this;
      }
    });
    
    const FakeUpdate = Ember.Object.extend({
      destroy: Ember.K
    });
    
    function makeUpdate () {
      return FakeUpdate.create({
        destroy: Ember.K
      });
    }
    
    function makeUpdates (number) {
      var updates = [];
      while (number--) {
        updates.push(makeUpdate())
      }
      return Ember.ArrayProxy.create({content: Ember.A(updates)});
    }
    
    beforeEach(function (done) {
      this.register('service:store', FakeStore);
      store = Ember.getOwner(this).lookup('service:store');
      this.register('service:crypto', FakeCrypto);
      crypto = Ember.getOwner(this).lookup('service:crypto');
      
      
      sut = this.subject();
      options = {
        onProgress: Ember.K
      };
      done()
    });
    
    describe('#pull() features', function () {
      beforeEach(function () {
      });
      
      it('should ask find updates with constructed options object', function () {
        options.updates = [];
        var findUpdates = simple.mock(sut, 'findUpdates').resolveWith(options);
        
        return sut.pull('user@example.com', options.onProgress).then(() => {
          assert(findUpdates.called);
          var arg = findUpdates.lastCall.arg;
          assert.equal(arg.emailHash, crypto.hashEmail('user@example.com'));
          assert.equal(arg.onProgress, options.onProgress);
        });
      });
      
      it('should process updates and resolve with options', function () {
        options.updates = [];
        simple.mock(sut, 'findUpdates').resolveWith(options);
        var processUpdates = simple.mock(sut, 'processUpdates').resolveWith(options);
        
        return sut.pull('user@example.com').then((result) => {
          assert(processUpdates.called);
          assert.equal(processUpdates.lastCall.arg, options);
          assert.equal(result, options);
        });
      });
    });
    
    describe('#findUpdates', function () {
      it('should ask store to query for updates with given hash', function () {
        options.emailHash = 'abc123';
        var query = simple.mock(store, 'query').resolveWith(new RecordArray());
        
        return sut.findUpdates(options).then(() => {
          assert.equal(query.lastCall.args[0], 'share');
          assert.deepEqual(query.lastCall.args[1], {emailSha256: 'abc123'});
        })
      });
      
      it('should resolve options object with updates as plain old array', function () {
        store.query = RSVP.resolve.bind(null, new RecordArray());
        return sut.findUpdates(options).then((result) => {
          assert.equal(result, options);
          assert.isArray(result.updates);
        })
      })
    });
    
    describe('#processUpdates', function () {
      it('should call processUpdate for each update', function () {
        var processUpdate = simple.mock(sut, 'processUpdate').resolveWith(options);
        options.updates = makeUpdates(3).toArray();
        var updates = options.updates.toArray().reverse();
        
        return sut.processUpdates(options).then(() => {
          assert.equal(processUpdate.callCount, 3);
          for (var i = processUpdate.callCount - 1; i >= 0; i--) {
            assert.equal(processUpdate.calls[i].args[0], options);
            assert.equal(processUpdate.calls[i].args[1], updates[i]);
          }
        });
      });
    });
    
    describe('#processUpdate', function () {
      let update, destroy;
      
      beforeEach(function () {
        update = makeUpdate();
        destroy = simple.mock(update, 'destroy');
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
      
      it('should destroy contact if decrypt throws', function () {
        mockSteps(sut);
        simple.mock(sut, 'decrypt').rejectWith(new Error('#decrypt threw'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroy.called, 'update#destroy() was not called');
          assert.equal(err.message, '#decrypt threw');
        });
      });
      
      it('should destroy contact if decode throws', function () {
        mockSteps(sut);
        simple.mock(sut, 'decode').rejectWith(new Error('#decode threw'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroy.called, 'update#destroy() was not called');
          assert.equal(err.message, '#decode threw');
        });
      });
      
      it('should destroy contact if validate throws', function () {
        mockSteps(sut);
        simple.mock(sut, 'validate').rejectWith(new Error('#validate threw'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroy.called, 'update#destroy() was not called');
          assert.equal(err.message, '#validate threw');
        });
      });
      
      it('should destroy contact if pushToContact throws', function () {
        mockSteps(sut);
        simple.mock(sut, 'pushToContact').rejectWith(new Error('#pushToContact threw'));
        
        return sut.processUpdate(options, update).then(() => {
          assert.fail(false, 'not rejected')
        }).catch((err) => {
          assert(destroy.called, 'update#destroy() was not called');
          assert.equal(err.message, '#pushToContact threw');
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
      let contacts, recordArray, findAll;
      
      beforeEach(function () {
        contacts = Ember.A();
        recordArray = new RecordArray();
        Ember.set(recordArray, 'content', contacts);
        findAll = simple.mock(store, 'findAll').resolveWith(recordArray);
      });
      
      it('should return undefined if contact could not be found', function () {
        return sut.findContact('unknown@example.com').then((result) => {
          assert.isUndefined(result);
        });
      });
      
      it('should return contact', function () {
        var contact = FakeContact.create();
        contact.set('emailAddress$', 'user@example.com');
        contacts.pushObject(contact);
        
        return sut.findContact('user@example.com').then((result) => {
          assert.isDefined(result);
          assert.equal(result, contact);
        });
      });
    });
  }
);
