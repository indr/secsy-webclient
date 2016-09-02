import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  addressbook: Ember.inject.service(),
  crypto: Ember.inject.service(),
  keystore: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  store: Ember.inject.service(),
  
  push(properties, onProgress) {
    const options = {
      onProgress: onProgress || Ember.K,
      payload: properties,
      status: {
        done: false,
        max: 0,
        value: 0
      }
    };
    
    const fireProgress = this.fireProgress.bind(this);
    
    return RSVP.resolve(options)
      .then(this.encodePayload.bind(this))
      .then(this.loadContacts.bind(this))
      .then(fireProgress)
      .then(this.processContacts.bind(this))
      .then(function (options) {
        options.status.done = true;
        fireProgress(options);
        return options;
      })
      .catch((err) => {
        options.status.done = true;
        fireProgress(options);
        throw err;
      });
  },
  
  fireProgress(options) {
    options.onProgress(Ember.copy(options.status, false));
    return options;
  },
  
  encodePayload(options) {
    return this.get('crypto').encodeBase64(options.payload).then((encoded) => {
      options.payload = encoded;
      return options;
    });
  },
  
  loadContacts(options) {
    return this.get('addressbook').findContacts().then((contacts) => {
      options.contacts = contacts.filterBy('emailAddress$');
      options.status.max = options.contacts.length;
      return options;
    });
  },
  
  processContacts(options) {
    const self = this;
    return RSVP.promiseFor(options, function condition (options) {
      return options.contacts.length > 0;
    }, function action (options) {
      var contact = options.contacts.pop();
      options.status.value++;
      
      return self.processContact(options, contact).catch(() => {
        return options;
      }).then(self.fireProgress.bind(self));
    }, options);
  },
  
  processContact(options, contact) {
    options.contact = contact;
    
    return this.getKey(options)
      .then(this.encryptPayload.bind(this))
      .then(this.createUpdate.bind(this));
  },
  
  getKey(options) {
    return this.get('keystore').getPublicKey(options.contact.get('emailAddress$')).then((key) => {
      const pgpKey = this.get('openpgp').key.readArmored(key.get('publicKey')).keys[0];
      options.key = key;
      options.key.pgpKey = pgpKey;
      return options;
    });
  },
  
  encryptPayload(options) {
    return this.get('crypto').encrypt(options.payload, options.key.pgpKey).then((encrypted) => {
      options.encrypted = encrypted;
      return options;
    });
  },
  
  createUpdate(options) {
    return this.get('store').createRecord('update', {
      emailSha256: options.key.emailSha256,
      encrypted_: options.encrypted
    }).save().then(() => {
      return options;
    });
  }
});
