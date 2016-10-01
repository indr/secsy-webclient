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
  Ember.debug('[route:reset-password] ' + message);
}

export default Ember.Route.extend({
  model(params) {
    debug('params.token: ' + params.token);
    
    return {token: params.token}
  },
  
  actions: {
    didTransition() {
      this.send('modalOpened');
    },
    
    resetted() {
      this.transitionTo('login')
    }
  }
});
