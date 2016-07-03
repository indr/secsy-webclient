import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  username: validator('presence', true),
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  username: null,
  password: null,

  actions: {
    login() {
      const { username, password } = this.getProperties('username', 'password');
      console.log('login clicked', username, password);

      this.sendAction('loggedIn');
    }
  }
});
