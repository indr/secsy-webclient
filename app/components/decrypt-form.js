import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  keyring: Ember.inject.service(),
  passphrase: null,

  actions: {
    decrypt() {
      const self = this;
      const passphrase = this.get('passphrase');

      const keyring = self.get('keyring');
      keyring.open(passphrase);
    }
  }
});
