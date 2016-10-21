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

function debug(message) {
  Ember.debug('[route:preferences/index] ' + message);
}

export default Ember.Route.extend(TrackerMixin, {
  addressbook: Ember.inject.service(),
  ajax: Ember.inject.service(),
  exporter: Ember.inject.service(),
  importer: Ember.inject.service(),
  saveAs: window.saveAs,
  session: Ember.inject.service(),
  
  actions: {
    exportContacts() {
      this.get('flashMessages').clearMessages();
      
      return this.get('addressbook').findContacts().then((contacts) => {
        return this.get('exporter').toVcards(contacts);
      }).then((cards) => {
        const blob = new Blob([cards], { type: "text/vcard:charset=utf-8" });
        this.saveAs(blob, 'secsy-contacts.vcf');
      }).catch((error) => {
        this.get('flashMessages').dangerT('errors.download-vcard-error', error);
      });
    },
    
    importContacts(files) {
      this.get('flashMessages').clearMessages();
      
      return this.get('importer').import(files).then((result) => {
        this.get('flashMessages').success('OK');
        console.log('result', result);
      }).catch((error) => {
        this.get('flashMessages').dangerT('errors.import-vcard-error', error);
      });
    },
    
    savePreferences() {
      const flash = this.get('flashMessages');
      const model = this.controller.get('model');
      
      flash.clearMessages();
      
      const preferences = {
        locale: model.locale,
        sync_enabled: model.syncEnabled
      };
      this.track('controller.savePreferencesState', this.get('ajax').patch('/api/users/me', preferences)).then(() => {
        this.send('setLocale', model.locale);
        this.get('session').set('data.authenticated.sync_enabled', preferences.sync_enabled);
      }).catch((error) => {
        flash.dangerT('profile.unknown-error', error);
      });
    },
    
    generateFakes() {
      const progress = this.send.bind(this, 'onProgress');
      this.track('controller.generateFakesState', this.get('addressbook').fake(progress));
    },
    
    deleteAll() {
      const progress = this.send.bind(this, 'onProgress');
      this.track('controller.deleteAllState', this.get('addressbook').clear(progress));
    },
    
    sendPullUpdates() {
      this.send('pullUpdates', {}, this.set.bind(this, 'controller.pullUpdatesState'))
    },
    
    sendPasswordResetEmail() {
      const flash = this.get('flashMessages');
      const email = this.controller.get('model.email');
      
      debug('send password reset for ' + email);
      
      flash.clearMessages();
      
      this.track('controller.sendPasswordResetEmailState', this.get('ajax').post('/api/users/forgot-password', { email })).then(() => {
        flash.successT('profile.reset-email.success');
      }).catch((error) => {
        flash.dangerT('profile.reset-email.unknown-error', error, { sticky: false });
      });
    }
  }
});
