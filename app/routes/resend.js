/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:resend] ' + message)
}

export default Ember.Route.extend({
  model() {
    try {
      // If /resend is the application entry route, login controller
      // has not been instantiated and throws an exception
      var controller = this.controllerFor('login');
      return controller.get('model').emailAddress
    } catch (error) {
      return null;
    }
  },
  
  afterModel(model) {
    if (!model) {
      debug('Model is undefined, transition to login');
      this.transitionTo('login')
    }
  },
  
  actions: {
    didTransition() {
      this.send('modalOpened');
    }
  }
});
