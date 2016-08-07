import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  keychain: Ember.inject.service(),
  keystore: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    decrypt() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = self.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.user');
      const passphrase = this.get('passphrase');
      
      keychain.open(userId, passphrase).then(() => {
        flash.successT('decrypt.success');
      }).catch((reason) => {
        flash.dangerT(reason, 'decrypt.unknown-error');
      });
    },
    
    generateKeys() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = this.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.user');
      const emailAddress = self.get('session.data.authenticated.email');
      const passphrase = self.get('passphrase');
      
      keychain.generateKey(userId, emailAddress, passphrase).then(() => {
        flash.successT('generate.success');
      }).catch((reason) => {
        flash.dangerT(reason, 'generate.unknown-error');
      });
    }
  }
});
