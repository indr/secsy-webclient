import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'})
    ]
  },
  password: validator('presence', true),
  passwordRepeat: validator('confirmation', {
    on: 'password', messageKey: 'errors.confirmation-password'
  })
});

export default Ember.Component.extend(Validations, {
  emailAddress: null,
  password: null,
  passwordRepeat: null,
  
  actions: {
    signup() {
      const self = this;
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      const model = this.get('model');
      model.set('email', emailAddress);
      model.set('password', password);
      model.save().then(() => {
        flash.successT('signup.success');
        self.sendAction('signedUp');
      }, ((err) => {
        flash.dangerT(err.message || err, 'signup.unknown-error');
      }));
    },
  }
});
