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
  session: Ember.inject.service(),
  
  canShare: Ember.computed('session.data.authenticated.sync_enabled', function () {
    return this.get('session').get('data.authenticated.sync_enabled');
  }),
  
  actions: {
    delete(model) {
      this.sendAction('delete', model);
    },
    
    share(model) {
      this.sendAction('share', model)
    }
  }
});
