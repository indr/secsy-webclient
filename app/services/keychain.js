import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend(Ember.Evented, {
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  
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
    this.set('isOpen', true);
    this.passphrase = passphrase;
    this.trigger('keychainOpened', ...arguments);
  },
  
  close() {
    Ember.Logger.info('Closing keychain');
    this.set('isOpen', false);
    this.trigger('keychainClosed', ...arguments);
  },
  
  /**
   * Uploads a key to the key server and adds the key to the keychain.
   *
   * @param key
   */
  save(key) {
    const {store, session} = this.getProperties('store', 'session');
      const userId = session.get('data.authenticated.user');
      return store.createRecord('public-key', {
        userId: userId,
        armored: key.publicKeyArmored
      }).save().then(() => {
        return store.createRecord('private-key', {
          userId: userId,
          armored: key.privateKeyArmored
        }).save();
      });
  },
  
  _subscribeToSessionEvents() {
    this.get('session').on('invalidationSucceeded',
      Ember.run.bind(this, () => {
        this['close'](...arguments);
      })
    );
  }
});
