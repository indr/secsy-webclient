import Ember from 'ember';
import {validator, buildValidations} from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'})
    ]
  },
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  session: Ember.inject.service(),
  intl: Ember.inject.service(),

  emailAddress: null,
  password: null,

  actions: {
    login() {
      const {flashMessages, intl} = this.getProperties('flashMessages', 'intl');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');

      this.get('session').authenticate('authenticator:seneca', emailAddress, password).then(() => {
        const message = intl.t('login.success');
        flashMessages.success(message);
      }, (reason) => {
        let message;
        if (intl.exists('errors.' + reason)) {
          message = intl.t('errors.' + reason);
        } else {
          message = intl.t('signup.unknown-error');
        }
        flashMessages.danger(message);
      });
    }
  }
});
