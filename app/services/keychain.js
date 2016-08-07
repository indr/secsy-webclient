import Ember from 'ember';

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
  
  _subscribeToSessionEvents() {
    this.get('session').on('invalidationSucceeded',
      Ember.run.bind(this, () => {
        this['close'](...arguments);
      })
    );
  }
});