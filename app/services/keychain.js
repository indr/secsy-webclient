import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  keystore: Ember.inject.service('keystore'),
  openpgp: Ember.inject.service(),
  session: Ember.inject.service(),
  
  isOpen: false,
  attemptedTransition: null,
  
  init() {
    this._super(...arguments);
    this._subscribeToSessionEvents();
  },
  
  getPublicKey() {
    if (!this.get('isOpen')) {
      throw new Error('Keychain is not open');
    }
    return this.publicKey;
  },
  
  getPrivateKey() {
    if (!this.get('isOpen')) {
      throw new Error('Keychain is not open');
    }
    return this.privateKey;
  },
  
  /**
   * TODO: Remove first param
   *
   * @param {String} userId
   * @param {String} passphrase
   * @returns {Promise}
   */
  open(userId, passphrase) {
    const self = this;
    const key = this.get('keystore').getPrivateKey();
    
    return this.get('openpgp').decryptKey({privateKey: key, passphrase: passphrase}).then((result) => {
      self.privateKey = result.key;
      self.publicKey = result.key;
      self._opened();
    });
  },
  
  /**
   * @returns undefined
   */
  close() {
    this.set('isOpen', false);
    this.publicKey = null;
    this.privateKey = null;
    this.trigger('keychainClosed', this);
  },
  
  /**
   * @param {String} userId
   * @param {String} emailAddress
   * @param {String} passphrase
   * @param {Number} bits
   * @returns {Promise}
   */
  generateKey(userId, emailAddress, passphrase, bits) {
    const self = this;
    
    const openpgp = self.get('openpgp');
    const keystore = self.get('keystore');
    
    return openpgp.generateKey(emailAddress, passphrase, bits, true).then((result) => {
      self.set('session.data.authenticated.user.privateKey', result.armoredPrivateKey);
      return keystore.save(userId, emailAddress, result).then(() => {
        self.publicKey = result.key;
        self.privateKey = result.key;
        self._opened();
      });
    });
  },
  
  _subscribeToSessionEvents() {
    this.get('session').on('invalidationSucceeded',
      Ember.run.bind(this, () => {
        this['close'](...arguments);
      })
    );
  },
  
  _opened() {
    const self = this;
    self.set('isOpen', true);
    self.trigger('keychainOpened', self);
  }
})
;
