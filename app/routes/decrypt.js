import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  keystore: Ember.inject.service(),
  session: Ember.inject.service(),
  
  model() {
    const userId = this.get('session.data.authenticated.user');
    return this.get('keystore').getPrivateKey(userId);
  },
  
  actions: {
    error: function(error/*, transition*/) {
      if (error.message === 'private-key-not-found') {
        this.transitionTo('generate');
        return false;
      }
      return true;
    }
  }
});
