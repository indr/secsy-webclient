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
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, {
  keychain: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    cancel() {
      this.sendAction('cancelled');
    },
    
    generate() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = this.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.id');
      const emailAddress = self.get('session.data.authenticated.email');
      const passphrase = self.get('passphrase');
      
      flash.infoT('generate.generating', {sticky: true});
      this.track('generateState', keychain.generateKey(userId, emailAddress, passphrase)).then(() => {
        flash.clearMessages();
      }).catch((error) => {
        flash.dangerT('generate.unknown-error', error);
      });
    }
  }
})
;
