import Ember from 'ember';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[puller] ' + message);
}

export default Ember.Service.extend({
  addressbook: Ember.inject.service(),
  crypto: Ember.inject.service(),
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
      onProgress: onProgress || Ember.K,
      status: {
        done: false,
        max: 0,
        value: 0
      }
    };
    
    const fireProgress = this.fireProgress.bind(this);
    
    debug('Start pulling updates for ' + emailAddress);
    return RSVP.resolve(options)
      .then(this.findUpdates.bind(this))
      .then(fireProgress)
      .then(this.processUpdates.bind(this))
      .then(function (options) {
        options.status.done = true;
        fireProgress(options);
        debug('Finished pulling updates for ' + emailAddress);
        return options;
      })
      .catch(function (err) {
        options.status.done = true;
        fireProgress(options);
        debug('Error pulling updates for ' + emailAddress);
        throw err;
      });
  },
  
  fireProgress(options) {
    options.onProgress(Ember.copy(options.status, false));
    return options;
  },
  
  /**
   * @private
   * @param options {Object}
   * @param options.emailHash {String}
   * @returns {Promise}
   * Resolves with DS.RecordArray
   */
  findUpdates(options) {
    return this.get('store').query('update', {emailSha256: options.emailHash}).then((recordArray) => {
      options.updates = recordArray.toArray();
      options.status.max = options.updates.length;
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
    return RSVP.promiseFor(options, function condition (options) {
      return options.updates.length > 0;
    }, function action (options) {
      var update = options.updates.pop();
      options.status.value++;
      
      return self.processUpdate(options, update).catch(() => {
        // TODO: Move the destroying of the update here?
        // debug('Error processing update: ' + err.message);
        return options;
      }).then(self.fireProgress.bind(self));
    }, options);
  },
  
  processUpdate(options, update) {
    options.update = update;
    
    return RSVP.resolve(options)
      .then(this.decrypt.bind(this))
      .then(this.decode.bind(this))
      .then(this.validate.bind(this))
      .then(this.pushToContact.bind(this))
      .then((options) => {
        return options;
      }).catch((err) => {
        debug('Error processing update: ' + err.message);
        update.destroyRecord().catch((err) => {
          // We don't care if this doesn't succeed.
          debug('Error destroying update: ' + err.message);
        });
        throw err;
      });
  },
  
  decrypt(options) {
    var update = options.update;
    return this.get('crypto').decrypt(update.get('encrypted_')).then((decrypted) => {
      update.decrypted = decrypted;
      return options;
    });
  },
  
  decode(options) {
    var update = options.update;
    return this.get('crypto').decodeBase64(update.decrypted).then((decoded) => {
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
    return this.get('addressbook').findContactBy('emailAddress$', emailAddress);
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
