import Ember from 'ember';

export default Ember.Mixin.create({
  keyring: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeyringEvents();
  },
  
  keyringOpened() {
    const attemptedTransition = this.get('keyring.attemptedTransition');
    
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.set('keyring.attemptedTransition', null);
    }
    else {
      this.transitionTo(Ember.ENV.APP.routeAfterDecryption);
    }
  },
  
  _subscribeToKeyringEvents() {
    this.get('keyring').on('keyringOpened',
      Ember.run.bind(this, () => {
        this['keyringOpened'](...arguments);
      })
    );
  }
});
