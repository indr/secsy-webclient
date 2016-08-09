import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import KeychainOpenedRouteMixin from '../mixins/keychain-opened-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, KeychainOpenedRouteMixin, {
  model() {
    return this.get('store').findAll('contact');
  },
  
  actions: {
    selectMarker: function (contact) {
      this.controllerFor('map').selectMarker(contact);
    }
  }
});
