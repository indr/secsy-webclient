import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  crypto: Ember.inject.service(),
  keychain: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    decrypt() {
      const self = this;
      const passphrase = this.get('passphrase');
      
      const keychain = self.get('keychain');
      keychain.open(passphrase);
    },
    
    generateKeys() {
      const self = this;
      const emailAddress = this.get('session.data.authenticated.email');
      const passphrase = this.get('passphrase');
      
      const crypto = self.get('crypto');
      crypto.generateKeyPair(emailAddress, passphrase)
        .then((key) => {
          console.log('yess', key);
        })
        .catch((err) => {
          console.log('nay', err);
        });
    }
  }
});
