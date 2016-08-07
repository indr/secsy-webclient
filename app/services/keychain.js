import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  
  privateKey: null,
  publicKey: null,
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
  
  open(passphrase) {
    Ember.Logger.info('Opening keychain');
    const self = this;
    return self._loadKeys().then(() => {
      self.passphrase = passphrase;
      self.set('isOpen', true);
      self.trigger('keychainOpened', ...arguments);
    });
  },
  
  close() {
    Ember.Logger.info('Closing keychain');
    this.publicKey = null;
    this.privateKey = null;
    this.set('isOpen', false);
    this.trigger('keychainClosed', ...arguments);
  },
  
  /**
   * Uploads a key to the key server and adds the key to the keychain.
   *
   * @param key
   */
  save(key) {
    const self = this;
    const {store, session} = this.getProperties('store', 'session');
    const userId = session.get('data.authenticated.user');
    return store.createRecord('public-key', {
      userId: userId,
      armored: key.publicKeyArmored
    }).save().then((publicKey) => {
      self.publicKey = publicKey;
      return store.createRecord('private-key', {
        userId: userId,
        armored: key.privateKeyArmored
      }).save().then((privateKey) => {
        self.privateKey = privateKey;
      });
    });
  },
  
  _loadKeys() {
    const self = this;
    const {store, session} = self.getProperties('store', 'session');
    const filter = {
      userId: session.get('data.authenticated.user')
    };
    return store.queryRecord('public-key', filter).then((publicKey) => {
      console.log('publicKey', publicKey);
      if (!publicKey) {
        throw new Error('public-key-not-exist');
      }
      self.publicKey = publicKey;
      return store.queryRecord('private-key', filter);
    }).then((privateKey) => {
      console.log('privateKey', privateKey);
      if (!privateKey) {
        throw new Error('private-key-not-exist');
      }
      self.privateKey = privateKey;
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
