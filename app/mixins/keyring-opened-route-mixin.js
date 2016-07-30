import Ember from 'ember';
import ENV from 'addressbook/config/environment';

const {inject: {service}, assert} = Ember;

export default Ember.Mixin.create({
  keyring: service(),
  
  beforeModel(transition) {
    console.log('mixins.decrypted-route-mixin');
    if (!this.get('keyring.isOpen')) {
      const decryptionRoute = ENV.APP.decryptionRoute;
      assert('The route configured as ENV.APP.decryptionRoute cannot implement the DecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        this.get('routeName') !== decryptionRoute);
      
      this.set('keyring.attemptedTransition', transition);
      return this.transitionTo(decryptionRoute);
    } else {
      return this._super(...arguments);
    }
  }
});
