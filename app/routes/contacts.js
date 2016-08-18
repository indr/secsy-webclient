import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
import KeychainOpenedRouteMixin from '../mixins/keychain-opened-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, KeychainOpenedRouteMixin, {
  session: Ember.inject.service(),
  
  firstTransition: true,
  
  model() {
    return this.get('store').findAll('contact');
  },
  
  actions: {
    didTransition() {
      if (this.firstTransition) {
        this.firstTransition = false;
        this.send('getShares');
      }
    }
  }
});
