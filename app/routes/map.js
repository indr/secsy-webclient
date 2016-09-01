import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMixin from '../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMixin, {
  addressbook: Ember.inject.service(),
  
  model() {
    return this.get('addressbook').findContacts({cache: false}).then((results) => {
      Ember.debug('routes/map#model() loaded ' + results.length + ' records');
      return results;
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
      
      const showDragAndDropHint = this.controller.get('model').any((contact) => contact.get('location') !== null);
      this.controller.set('showDragAndDropHint', showDragAndDropHint);
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
