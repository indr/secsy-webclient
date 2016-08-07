import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend(Ember.Evented, {
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
    return new RSVP.Promise((resolve) => {
      console.log('saving key (stub)', key);
      window.setTimeout(() => {
        console.log('key saved', key);
        resolve(key)
      }, 1000 * 2);
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
