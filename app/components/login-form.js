import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'})
    ]
  },
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  }
});

export default Ember.Component.extend(Validations, {
  session: Ember.inject.service(),
  
  emailAddress: null,
  password: null,
  
  actions: {
    login() {
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      this.get('session').authenticate('authenticator:local', emailAddress, password).then(() => {
        flash.successT('login.success');
      }, (reason) => {
        flash.dangerT('login.unknown-error', reason);
      });
    }
  }
});
