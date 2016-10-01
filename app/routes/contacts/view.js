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

function debug (message) {
  Ember.debug('[route:contacts/view] ' + message);
}

export default Ember.Route.extend(TrackerMixin, {
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id).then((record) => {
      debug('Found record ' + (record.get('id') || record));
      return record;
    });
  },
  
  actions: {
    delete(model) {
      if (model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT('errors.no-delete-self');
        return;
      }
      
      this.track('controller.deleteState', model.destroyRecord()).then(() => {
        this.transitionTo('contacts');
      }).catch((error) => {
        this.get('flashMessages').dangerT('errors.delete-unknown-error', error);
      });
    },
    
    transitionToShare(model) {
      this.transitionTo('contacts.share', model)
    }
  }
});
