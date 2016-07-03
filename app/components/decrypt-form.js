import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),

  password: null,

  actions: {
    decrypt() {
      // 1. Get contacts
      // 2. Decrypt
      // 3. Set decrypted flag
      // 4. Transition to contacts

      const self = this;
      const password = this.get('password');
      this.get('store').findAll('contact')
        .then(function (contacts) {
          console.log('TODO: Decrypting', contacts.get('length'), password);
          console.log('TODO: Set decrypted flag');
          self.sendAction('decrypted');
        });
    }
  }
});
