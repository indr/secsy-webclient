/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      this.sendAction('save');
    },
    
    cancel() {
      this.sendAction('cancel');
    },
    
    removeCoordinate() {
      this.get('model').set('location_latitude$', null);
      this.get('model').set('location_longitude$', null);
    }
  }
});
