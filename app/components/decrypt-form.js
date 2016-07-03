import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  addressbook: Ember.inject.service('addressbook'),
  password: null,

  actions: {
    decrypt() {
      const self = this;
      const addressbook = this.get('addressbook');
      const password = this.get('password');

      addressbook.decrypt(password)
        .then(function () {
          self.sendAction('decrypted');
        });
    }
  }
});
