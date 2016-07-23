import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: validator('presence', true),
  password: validator('presence', true),
  passwordRepeat: validator('presence', true)
});

export default Ember.Component.extend(Validations, {

  username: null,
  password: null,
  passwordRepeat: null,

  actions: {
    signup() {
      console.log('component.signup-form.actions.signup');
    }
  }
});
