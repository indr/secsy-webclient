/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

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
      // Could also be useful for forget-password route.
      this.controller.set('model', {emailAddress: email});
      
      this.transitionTo('resend');
    }
  }
});
