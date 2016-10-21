/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import Addressbook from 'secsy-webclient/services/addressbook';
import DsRecordArray from 'ember-data/-private/system/record-arrays/record-array'
import simple from 'simple-mock';

const {
  isBlank,
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

const FakeModel = Ember.Object.extend({
  save() {
    return RSVP.reject();
  }
});

const FakeAddressbook = Addressbook.extend({});

const FakeContact = FakeModel.extend({
  getRecord(){
    return this;
  },
  
  location: Ember.computed('location_latitude$', 'location_longitude$', function () {
    if (isBlank(this.get('location_latitude$')) || isBlank(this.get('location_longitude$'))) {
      return null;
    }
    return [this.get('location_latitude$'), this.get('location_longitude$')];
  })
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

const FakeExporter = Ember.Object.extend({
  contactTovCard3: function () {
    return 'BEGIN:VCARD...';
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
  createRecord: function () { return FakeModel.create(); },
  findAll: RSVP.reject,
  query: RSVP.reject
});

const FakeUpdate = Ember.Object.extend({
  destroyRecord: RSVP.resolve,
  getRecord() {
    return this;
  }
});

const FileReader = Ember.Object.extend({
  
});

const FlashMessages = Ember.Object.extend({
  init() {
    this._super(...arguments);
    this.dangerT = simple.mock()
  },
  
  clearMessages: Ember.K
});

const UpdatePuller = Ember.Object.extend({
  init() {
    this._super(...arguments);
    this.pull = simple.mock();
  }
});

const UpdatePusher = Ember.Object.extend({});

const Session = Ember.Object.extend({
  data: {authenticated: {}},
  on: Ember.K
});

function track (prop, promise) {
  return promise ? promise : prop
}

export {
  ArrayProxy,
  FakeAddressbook,
  FakeContact,
  FakeCrypto,
  FakeExporter,
  FakeKey,
  FakeKeystore,
  FakeOpenpgp,
  FakeStore,
  FakeUpdate,
  FlashMessages,
  FileReader,
  RecordArray,
  Session,
  track,
  UpdatePuller,
  UpdatePusher
};
