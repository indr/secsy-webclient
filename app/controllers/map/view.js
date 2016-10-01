/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

export default Ember.Controller.extend({
  setLocation(location) {
    const model = this.get('model');
    
    if (model && model.get('location') === null) {
      model.set('location_latitude$', location.lat);
      model.set('location_longitude$', location.lng);
      
      return model.save().catch((error) => {
        this.get('flashMessages').dangerT('errors.save-unknown', error);
      });
    }
  }
});
