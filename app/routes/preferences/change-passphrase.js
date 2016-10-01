/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    changed() {
      this.transitionTo('preferences');
    },
    
    didTransition() {
      this.send('modalOpened');
    }
  }
});
