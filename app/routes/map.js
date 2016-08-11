import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import KeychainOpenedRouteMixin from '../mixins/keychain-opened-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, KeychainOpenedRouteMixin, {
  model() {
    return this.get('store').findAll('contact');
  },
  
  actions: {
    openPopup(contact) {
      this.controller.openPopup(contact);
    },
    
    setCenter(location, zoom) {
      this.controller.setCenter(location, zoom);
    },
    
    didTransition() {
      // Close popup when we transitioned to here (map.index).
      // This is the case when we are in the child route (map.view)
      // and the user clicks in the main menu on 'map'.
      this.controller.closePopup();
    },
    
    willTransition(transition) {
      // Tell controller to make no transition to here (map/map.index).
      // This would interrupt a transition to a different route like 'contacts'.
      if (transition.targetName.indexOf('map.') === -1) {
        this.controller.doTransitionOnClosed = false;
      }
    }
  }
});
