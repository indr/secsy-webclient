/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import TrackerMixin from './../../mixins/tracker-mixin';

export default Ember.Controller.extend(TrackerMixin, {
  session: Ember.inject.service(),
  
  // Ugly as hell, but the easiest way the retrieve the state from contacts.share
  shareState: Ember.computed('session.data.updatePusherState', function () {
    return this.get('session.data.updatePusherState');
  })
});
