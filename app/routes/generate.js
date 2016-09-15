import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UndecryptedRouteMixin from './../mixins/undecrypted-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, UndecryptedRouteMixin, {
  keystore: Ember.inject.service(),
  session: Ember.inject.service(),
  
  actions: {
    cancelled() {
      if (this.get('keystore').hasPrivateKey()) {
        this.transitionTo('decrypt');
      } else {
        this.get('session').invalidate();
      }
    },
    
    didTransition() {
      this.send('modalOpened');
    }
  }
});
