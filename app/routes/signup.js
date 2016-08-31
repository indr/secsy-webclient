import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  store: Ember.inject.service(),
  
  model() {
    return this.get('store').createRecord('user');
  },
  
  actions: {
    didTransition() {
      this.send('modalOpened');
    },
    
    signedUp() {
      this.transitionTo('login');
    }
  }
});
