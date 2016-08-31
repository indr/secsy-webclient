import Ember from 'ember';
import ENV from 'addressbook/config/environment';

export default Ember.Mixin.create({
  keychain: Ember.inject.service(''),
  
  beforeModel(transition) {
    if (this.get('keychain').isOpen) {
      const routeIfAlreadyDecrypted = ENV.APP.routeIfAlreadyDecrypted;
      Ember.assert('The route configured as ENV.APP.routeIfAlreadyDecrypted cannot implement the UndecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        this.get('routeName') !== routeIfAlreadyDecrypted);
      
      transition.abort();
      this.transitionTo(routeIfAlreadyDecrypted);
    } else {
      return this._super(...arguments);
    }
  }
});
