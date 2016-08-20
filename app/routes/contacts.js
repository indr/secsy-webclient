import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMixin from '../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMixin, {
  firstTransition: true,
  
  model() {
    return this.get('store').findAll('contact');
  },
  
  actions: {
    didTransition() {
      if (this.firstTransition) {
        this.firstTransition = false;
        this.send('getShares', {silent: true});
      }
    }
  }
});
