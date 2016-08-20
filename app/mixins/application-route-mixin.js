import Ember from 'ember';

export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeychainEvents();
  },
  
  keychainOpened() {
    const attemptedTransition = this.get('keychain.attemptedTransition');
    
    if (attemptedTransition) {
      this.set('keychain.attemptedTransition', null);
      attemptedTransition.retry();
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
