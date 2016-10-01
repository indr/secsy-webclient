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
  Ember.debug('[route:map/view] ' + message);
}

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  beforeModel(transition) {
    this.center = transition.queryParams.center;
  },
  
  model(params) {
    this.center = true;
    return this.get('store').findRecord('contact', params.id).then((record) => {
      debug('Found record ' + (record.get('id') || record));
      return record;
    });
  },
  
  actions: {
    didTransition() {
      if (this.center) {
        this.send('setCenter', this.controller.model.get('location'), 3);
      }
      this.send('openPopup', this.controller.model);
    }
  }
});
