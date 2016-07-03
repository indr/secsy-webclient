import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  username: validator('presence', true),
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  session: Ember.inject.service('session'),

  username: null,
  password: null,

  actions: {
    login() {
      const { username, password } = this.getProperties('username', 'password');

      this.get('session').authenticate('authenticator:oauth2', username, password)
        .catch((reason) => {
          console.log(reason.error || reason);
          this.set('errorMessage', reason.error || reason);
        });
    }
  }
});
