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

export default Ember.Route.extend(TrackerMixin, {
  intl: Ember.inject.service(),
  store: Ember.inject.service(),
  
  model() {
    return this.get('store').createRecord('contact');
  },
  
  actions: {
    save() {
      const model = this.controller.get('model');
      this.track('controller.saveState', model.save()).then(() => {
        this.transitionTo('contacts.view', model);
      }).catch((error) => {
        this.get('flashMessages').dangerT('errors.save-unknown', error);
      });
    },
    
    cancel() {
      this.controller.get('model').rollbackAttributes();
      this.transitionTo('contacts');
    },
    
    willTransition(transition) {
      const model = this.controller.get('model');
      if (!model.get('hasDirtyAttributes')) {
        return;
      }
      
      const message = this.get('intl').t('confirm.pending-unsaved');
      if (window.confirm(message)) {
        model.rollbackAttributes();
      } else {
        transition.abort();
      }
    }
  }
});
