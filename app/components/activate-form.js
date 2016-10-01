/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';

export default Ember.Component.extend(TrackerMixin, {
  ajax: Ember.inject.service(),
  
  actions: {
    activate() {
      const flash = this.get('flashMessages');
      const token = this.token;
      const sendAction = this.sendAction.bind(this, 'activated');
      
      flash.clearMessages();
      this.track('activateState', this.get('ajax').post('/api/users/confirm', {token})).then(() => {
        flash.successT('activate.success');
        Ember.run.later(sendAction, 1500);
      }).catch((error) => {
        flash.dangerT('activate.unknown-error', error, {sticky: true});
      });
    }
  }
});
