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
  passwordRepeat: validator('confirmation', {
    on: 'password', messageKey: 'errors.confirmation-password'
  })
});


export default Ember.Component.extend(Validations, ValidationErrorsMixin, {
  emailAddress: null,
  password: null,
  passwordRepeat: null,
  
  actions: {
    signup() {
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      const model = this.get('model');
      model.set('email', emailAddress);
      model.set('password', password);
      
      model.save().then(() => {
        flash.successT('signup.success');
        this.sendAction('signedUp');
      }, ((err) => {
        if (!this.handleValidationErrors(err, {email: 'emailAddress', username: 'emailAddress'})) {
          flash.dangerT(err.message || err, 'signup.unknown-error');
        }
      }));
    },
  }
});
