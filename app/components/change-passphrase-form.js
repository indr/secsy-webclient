import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorsMixin from '../mixins/validation-errors-mixin';

const Validations = buildValidations({
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64}),
      validator('ds-error')
    ]
  },
  passphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  },
  newPassphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  },
  confirmPassphrase: {
    validators: [
      validator('presence', true),
      validator('confirmation', {
        on: 'newPassphrase', messageKey: 'errors.confirmation-new-passphrase'
      })
    ]
  }
});

export default Ember.Component.extend(Validations, ValidationErrorsMixin, {
  actions: {
    changePassphrase() {
      const flash = this.get('flashMessages');
      
      flash.dangerT('profile.change-passphrase.unknown-error');
    }
  }
});
