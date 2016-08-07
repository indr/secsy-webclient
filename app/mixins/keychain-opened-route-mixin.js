import Ember from 'ember';
import ENV from 'addressbook/config/environment';

export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  beforeModel(transition) {
    if (!this.get('keychain.isOpen')) {
      const decryptionRoute = ENV.APP.decryptionRoute;
      Ember.assert('The route configured as ENV.APP.decryptionRoute cannot implement the DecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        this.get('routeName') !== decryptionRoute);
      
      this.set('keychain.attemptedTransition', transition);
      return this.transitionTo(decryptionRoute);
    } else {
      return this._super(...arguments);
    }
  }
});
