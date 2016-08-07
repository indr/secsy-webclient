import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  keychain: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    decrypt() {
      const self = this;
      const passphrase = this.get('passphrase');
      
      const keychain = self.get('keychain');
      keychain.open(passphrase).catch((err) => {
        console.log('catch', err.message || err);
      });
    },
    
    generateKeys() {
      const self = this;
      const emailAddress = this.get('session.data.authenticated.email');
      const passphrase = this.get('passphrase');
      
      const openpgp = self.get('openpgp');
      const keychain = self.get('keychain');
      console.log('Generating key');
      openpgp.generateKey(emailAddress, passphrase).then((key) => {
        return keychain.save(key);
      }).catch((err) => {
        console.log('catch', err.message || err);
      });
    }
  }
});
