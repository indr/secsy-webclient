import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  actions: {
    didTransition() {
      this.send('modalOpened');
    },
    
    userNotConfirmed(email) {
      // This is used by resend route model() as I could find a better way to pass
      // the email address to the resend route or controller.
      // Maybe we should use a proper model for the login route anyway and put
      // validation etc on that.
      this.controller.set('model', {emailAddress: email});
      
      this.transitionTo('resend');
    }
  }
});
