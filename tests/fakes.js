import Ember from 'ember';
import Addressbook from 'addressbook/services/addressbook';
import DsRecordArray from 'ember-data/-private/system/record-arrays/record-array'

const {
  RSVP
} = Ember;

const ArrayProxy = {
  create: function createArrayProxy (array) {
    return Ember.ArrayProxy.create({content: Ember.A(array)});
  }
};

const RecordArray = {
  create: function createRecordArray (array) {
    return DsRecordArray.create({content: Ember.A(array)});
  }
};

const FakeAddressbook = Addressbook.extend({});

const FakeContact = Ember.Object.extend({
  getRecord(){
    return this;
  }
});

const FakeCrypto = Ember.Object.extend({
  decrypt: RSVP.resolve.bind(null, {base64: ''}),
  decodeBase64: RSVP.resolve.bind(null, {}),
  encodeBase64: function (obj) {
    return new RSVP.Promise((resolve) => {
      resolve(window.btoa(JSON.stringify(obj)));
    });
  },
  hashEmail: function () {
    return 'default hash';
  }
});

const FakeKey = Ember.Object.extend({
  publicKey: 'armored public key',
  emailSha256: 'emailSha256'
});

const FakeKeystore = Ember.Object.extend({});

const FakeOpenpgp = Ember.Object.extend({
  key: {
    readArmored: Ember.K,
  }
});

const FakeStore = Ember.Object.extend({
  findAll: RSVP.reject,
  query: RSVP.reject
});

const FakeUpdate = Ember.Object.extend({
  destroyRecord: RSVP.resolve,
  getRecord() {
    return this;
  }
});

export {
  ArrayProxy,
  FakeAddressbook,
  FakeContact,
  FakeCrypto,
  FakeKey,
  FakeKeystore,
  FakeOpenpgp,
  FakeStore,
  FakeUpdate,
  RecordArray
};
