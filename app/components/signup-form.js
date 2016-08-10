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
  senecaAuth: Ember.inject.service(),
  
  emailAddress: null,
  password: null,
  passwordRepeat: null,
  
  actions: {
    signup() {
      const self = this;
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      this.get('senecaAuth').register(emailAddress, password).then((result) => {
        if (!result.ok) {
          flash.dangerT(result.why, 'signup.unknown-error');
          return;
        }
        flash.successT('signup.success');
        self.sendAction('signedUp');
      }, (reason) => {
        flash.dangerT(reason, 'signup.unknown-error');
      });
    }
  }
});
