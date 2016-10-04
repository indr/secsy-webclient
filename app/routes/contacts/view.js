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
  exporter: Ember.inject.service(),
  saveAs: window.saveAs,
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id).then((record) => {
      debug('Found record ' + (record.get('id') || record));
      return record;
    });
  },
  
  actions: {
    delete(model) {
      const flash = this.get('flashMessages');
      
      if (model.get('me')) {
        flash.dangerT('errors.no-delete-self');
        return;
      }
      
      this.track('controller.deleteState', model.destroyRecord()).then(() => {
        this.transitionTo('contacts');
      }).catch((error) => {
        flash.dangerT('errors.delete-unknown-error', error);
      });
    },
    
    downloadCard(model) {
      const flash = this.get('flashMessages');
      
      return this.get('exporter').toVcard(model).then((card) => {
        const blob = new Blob([card], {type: "text/vcard:charset=utf-8"});
        this.saveAs(blob, model.get('name$').replace(/ /g, '_').replace(/[^a-z0-9_]/gi, '') + '.vcf');
      }).catch((error) => {
        flash.dangerT('errors.download-vcard-error', error);
      });
    },
    
    transitionToShare(model) {
      this.transitionTo('contacts.share', model)
    }
  }
});
