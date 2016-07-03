import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  addressbook: Ember.inject.service('addressbook'),
  passphrase: null,

  actions: {
    decrypt() {
      const self = this;
      const addressbook = this.get('addressbook');
      const passphrase = this.get('passphrase');

      addressbook.decrypt(passphrase)
        .then(function () {
          self.sendAction('decrypted');
        });
    }
  }
});
