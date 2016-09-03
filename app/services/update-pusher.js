import Ember from 'ember';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[pusher] ' + message);
}

export default Ember.Service.extend({
  addressbook: Ember.inject.service(),
  crypto: Ember.inject.service(),
  keystore: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  store: Ember.inject.service(),
  
  push(data, emailAddress, onProgress) {
    this.validateData(data, emailAddress);
    data.emailAddress$ = emailAddress;
    
    const options = {
      onProgress: onProgress || Ember.K,
      payload: data,
      status: {
        done: false,
        max: 0,
        value: 0
      }
    };
    
    const fireProgress = this.fireProgress.bind(this);
    
    debug('Start pushing updates for ' + emailAddress);
    return RSVP.resolve(options)
      .then(this.encodePayload.bind(this))
      .then(this.loadContacts.bind(this))
      .then(fireProgress)
      .then(this.processContacts.bind(this))
      .then(function (options) {
        options.status.done = true;
        fireProgress(options);
        debug('Finished pushing updates for ' + emailAddress);
        return options;
      })
      .catch((err) => {
        options.status.done = true;
        fireProgress(options);
        debug('Error pushing updates for ' + emailAddress);
        throw err;
      });
  },
  
  validateData(data, emailAddress) {
    delete data.emailAddress$;
    
    const keys = Object.keys(data);
    if (keys.length === 0) {
      throw new Error('You must provide at least one property except emailAddress$');
    }
    if (!Object.keys(data).every((each) => {
        return !!each.match(/^[a-z_]+\$$/i)
      })) {
      throw new Error('Data properties must match letters, underscore and a trailing dollar sign');
    }
    
    if (!emailAddress || !emailAddress.match(/^[^@]+@[^@]+$/)) {
      throw new Error('A valid email address must be provided');
    }
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
      
      return self.processContact(options, contact).catch((err) => {
        debug('Error processing contact: ' + err.message);
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
      if (!key) {
        // TODO: Throw a custom Error object
        // See: http://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
        throw new Error('Public key not found');
      }
      
      const pgpKey = this.get('openpgp').key.readArmored(key.get('publicKey')).keys[0];
      options.key = {
        hash: key.get('emailSha256'),
        pgpKey: pgpKey
      };
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
      emailSha256: options.key.hash,
      encrypted_: options.encrypted
    }).save().then(() => {
      return options;
    });
  }
});
