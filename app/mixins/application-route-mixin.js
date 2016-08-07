import Ember from 'ember';
import ENV from 'addressbook/config/environment';

export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeychainEvents();
  },
  
  keychainOpened() {
    const attemptedTransition = this.get('keychain.attemptedTransition');
    
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.set('keychain.attemptedTransition', null);
    }
    else {
      this.transitionTo(ENV.APP.routeAfterDecryption);
    }
  },
  
  _subscribeToKeychainEvents() {
    this.get('keychain').on('keychainOpened',
      Ember.run.bind(this, () => {
        this['keychainOpened'](...arguments);
      })
    );
  }
});
