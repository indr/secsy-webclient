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
  session: Ember.inject.service(),
  
  canPullUpdates: Ember.computed('session.data.authenticated.sync_enabled', function () {
    return this.get('session').get('data.authenticated.sync_enabled');
  })
});
