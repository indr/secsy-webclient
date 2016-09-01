import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  crypto: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  store: Ember.inject.service(),
  
  /**
   *
   * @param {String} emailAddress
   * @param {Function} onProgress
   * @returns {Promise}
   *
   *
   * @public
   */
  pull(emailAddress, onProgress) {
    const emailHash = this.get('crypto').hashEmail(emailAddress);
    
    var options = {
      emailHash,
      onProgress: onProgress || Ember.K
    };
    return this.findUpdates(options).then(this.processUpdates.bind(this));
  },
  
  /**
   * @private
   * @param options {Object}
   * @param options.emailHash {String}
   * @returns {Promise}
   * Resolves with DS.RecordArray
   */
  findUpdates(options) {
    return this.get('store').query('share', {emailSha256: options.emailHash}).then((recordArray) => {
      options.updates = recordArray.toArray();
      return options;
    })
  },
  
  /**
   * @private
   * @param options
   * @returns {Promise}
   */
  processUpdates(options) {
    const self = this;
    return RSVP.promiseFor(null, function condition (options) {
      return options.updates.length > 0;
    }, function action (options) {
      var update = options.updates.pop();
      return self.processUpdate(options, update);
    }, options);
  },
  
  processUpdate(options, update) {
    options.update = update;
    return this.decrypt(options)
      .then(this.decode.bind(this))
      .then(this.validate.bind(this))
      .then(this.pushToContact.bind(this))
      .then((options) => {
        return options;
      }).catch((err) => {
        update.destroy();
        throw err;
      });
  },
  
  decrypt(options) {
    var update = options.update;
    return this.get('crypto').decrypt(update.get('encrypted_')).then((decrypted) => {
      update.decrypted = decrypted.base64;
      return options;
    });
  },
  
  decode(options) {
    var update = options.update;
    return this.get('crypto').decodeBase64(update.get('decrypted')).then((decoded) => {
      update.decoded = decoded;
      return options;
    });
  },
  
  validate(options) {
    var update = options.update;
    if (!update.decoded || !update.decoded.emailAddress$) {
      throw new Error('Validation failed: No decoded email address');
    }
    
    var hash = this.get('crypto').hashEmail(update.decoded.emailAddress$);
    if (update.get('from_email_sha256') !== hash) {
      throw new Error('Validation failed: Invalid email hash');
    }
    
    return options;
  },
  
  /**
   * @param emailAddress
   * @returns {Promise}
   *
   * Resolve promise with a contact or undefined if contact could not be found.
   */
  findContact(emailAddress) {
    return this.get('store').findAll('contact').then((contacts) => {
      return contacts.findBy('emailAddress$', emailAddress)
    }).then((contact) => {
      return contact;
    });
  },
  
  pushToContact(options) {
    var update = options.update;
    return this.findContact(update.decoded.emailAddress$).then((contact) => {
      if (!contact) {
        throw new Error('Contact not found');
      }
      contact.pushUpdate(update);
      return options;
    });
  }
});
