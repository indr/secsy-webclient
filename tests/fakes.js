import Ember from 'ember';
import Addressbook from 'addressbook/services/addressbook';

const {
  RSVP
} = Ember;

const ArrayProxy = {
  create: function createArrayProxy (array) {
    return Ember.ArrayProxy.create({content: Ember.A(array)});
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
  hashEmail: function () {
    return 'default hash';
  }
});

const FakeStore = Ember.Object.extend({
  findAll: RSVP.reject,
  query: RSVP.reject
});

const FakeUpdate = Ember.Object.extend({
  destroyRecord: RSVP.resolve
});

export {
  ArrayProxy,
  FakeAddressbook,
  FakeContact,
  FakeCrypto,
  FakeStore,
  FakeUpdate
}
