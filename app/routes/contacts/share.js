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

function debug () {
  // Ember.debug('[route:contacts/share] ' + arguments[0]);
}

export default Ember.Route.extend(TrackerMixin, {
  flashMessages: Ember.inject.service(),
  session: Ember.inject.service(),
  updatePusher: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id).then((record) => {
      debug('Found record ' + (record.get('id') || record));
      return record;
    });
  },
  
  afterModel(contact/*, transition*/) {
    if ((contact.get('me') !== true) || (!this.get('session').get('data.authenticated.sync_enabled'))) {
      debug('Contact is not me! Transitioning to contacts.view...');
      this.transitionTo('contacts.view', contact);
    }
  },
  
  setUpdatePusherState(state) {
    // Ugly as hell, but the easiest way to propagate the state to contacts.view
    this.get('session').set('data.updatePusherState', state);
  },
  
  actions: {
    share(data) {
      const {
        updatePusher,
        flashMessages
      } = this.getProperties('updatePusher', 'flashMessages');
      
      const emailAddress = this.get('session').get('data.authenticated.email');
      const onProgress = this.send.bind(this, 'onProgress');
      
      try {
        const result = this.track(this.setUpdatePusherState.bind(this), updatePusher.push(data, emailAddress, onProgress)).catch((error) => {
          flashMessages.dangerT('share.unknown-error', error);
        });
        this.transitionTo('contacts.view', this.controller.get('model'));
        return result;
      } catch (error) {
        flashMessages.dangerT('share.unknown-error', error);
      }
    },
    
    cancel() {
      const model = this.controller.get('model');
      this.transitionTo('contacts.view', model);
    }
  }
});
