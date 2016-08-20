import Ember from 'ember';
import ENV from 'addressbook/config/environment';

export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  beforeModel(transition) {
    if (this.get('keychain').isOpen) {
      return this._super(...arguments);
    }
    
    const self = this;
    const _super = this._super.bind(this, ...arguments);
    const keychain = this.get('keychain');
    return keychain.restore().then(() => {
      return _super();
    }).catch(() => {
      const decryptionRoute = ENV.APP.decryptionRoute;
      Ember.assert('The route configured as ENV.APP.decryptionRoute cannot implement the DecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        self.get('routeName') !== decryptionRoute);
      
      transition.abort();
      self.set('keychain.attemptedTransition', transition);
      return self.transitionTo(decryptionRoute);
    });
  }
});
