import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  keystore: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  session: Ember.inject.service(),
  
  isOpen: false,
  passphrase: null,
  
  attemptedTransition: null,
  
  init() {
    this._super(...arguments);
    this._subscribeToSessionEvents();
  },
  
  getPassphrase() {
    return this.passphrase;
  },
  
  /**
   * @param passphrase
   * @returns {Promise}
   */
  open(userId, passphrase) {
    const self = this;
    
    const keystore = this.get('keystore');
    
    return keystore.load(userId).then(() => {
      self.passphrase = passphrase;
      self.set('isOpen', true);
      self.trigger('keychainOpened', self);
    });
  },
  
  /**
   * @returns undefined
   */
  close() {
    Ember.Logger.info('Closing keychain');
    this.set('isOpen', false);
    this.trigger('keychainClosed', this);
  },
  
  /**
   * @param userId
   * @param emailAddress
   * @param passphrase
   * @returns {Promise}
   */
  generateKey(userId, emailAddress, passphrase) {
    const self = this;
    
    const openpgp = self.get('openpgp');
    const keystore = self.get('keystore');
    
    return openpgp.generateKey(emailAddress, passphrase).then((key) => {
      return keystore.save(userId, key);
    }).then(() => {
      self.passphrase = passphrase;
      self.set('isOpen', true);
      self.trigger('keychainOpened', self);
    });
  },
 
  _subscribeToSessionEvents() {
    this.get('session').on('invalidationSucceeded',
      Ember.run.bind(this, () => {
        this['close'](...arguments);
      })
    );
  }
})
;
