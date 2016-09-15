import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorsMixin from '../mixins/validation-errors-mixin';

const Validations = buildValidations({
  emailAddress: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'}),
      validator('ds-error')
    ]
  },
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64}),
      validator('ds-error')
    ]
  },
  passwordRepeat: {
    validators: [
      validator('presence', true),
      validator('confirmation', {
        on: 'password', messageKey: 'errors.confirmation-password'
      })
    ]
  }
});


export default Ember.Component.extend(Validations, ValidationErrorsMixin, {
  emailAddress: null,
  password: null,
  passwordRepeat: null,
  
  showSuccess: false,
  
  actions: {
    signup() {
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      const model = this.get('model');
      model.set('email', emailAddress);
      model.set('password', password);
      
      model.save().then(() => {
        this.set('showSuccess', true)
      }).catch((error) => {
        return this.handleValidationErrors(error, {email: 'emailAddress', username: 'emailAddress'});
      }).catch((error) => {
        flash.dangerT('signup.unknown-error', error.getMessage());
      });
    }
  }
});
