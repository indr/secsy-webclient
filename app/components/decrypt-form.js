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
      
      const userId = self.get('session.data.authenticated.user');
      const passphrase = this.get('passphrase');
      
      keychain.open(userId, passphrase).catch((err) => {
        console.log('catch', err.message || err);
      });
    },
    
    generateKeys() {
      const self = this;
      const keychain = self.get('keychain');
      
      const userId = self.get('session.data.authenticated.user');
      const emailAddress = self.get('session.data.authenticated.email');
      const passphrase = self.get('passphrase');
      
      keychain.generateKey(userId, emailAddress, passphrase).catch((err) => {
        console.log('catch', err.message || err);
      });
    }
  }
});
