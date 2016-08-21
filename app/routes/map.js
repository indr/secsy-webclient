import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMixin from '../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMixin, {
  model() {
    return this.get('store').findAll('contact').then((contacts) => {
      console.log('routes/map#model() loaded %s records', contacts.get('length'));
      return contacts;
    });
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
    },
    
    mapClicked(mouseEvent) {
      this.controllerFor('map.view').set('location', mouseEvent.latlng);
    }
  }
});
