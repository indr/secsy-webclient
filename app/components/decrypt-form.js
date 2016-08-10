import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  keychain: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    decrypt() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = self.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.user');
      const passphrase = this.get('passphrase');
      
      flash.infoT('decrypt.decrypting');
      keychain.open(userId, passphrase).then(() => {
        flash.successT('decrypt.success');
      }).catch((reason) => {
        if (reason.message.indexOf('Invalid passphrase') >= 0) {
          flash.dangerT('invalid-passphrase');
          this.set('showForgot', true);
        }
        else {
          flash.dangerT(reason, 'decrypt.unknown-error');
        }
      });
    }
  }
});
