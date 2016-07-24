import Ember from 'ember';
import {validator, buildValidations} from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: validator('presence', true),
  password: validator('presence', true),
  passwordRepeat: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  flashMessages: Ember.inject.service(),
  intl: Ember.inject.service(),
  senecaAuth: Ember.inject.service(),

  emailAddress: null,
  password: null,
  passwordRepeat: null,

  actions: {
    signup() {
      const flashMessages = this.get('flashMessages');
      const intl = this.get('intl');

      const emailAddress = this.get('emailAddress');
      const password = this.get('password');

      this.get('senecaAuth').register(emailAddress, password).then(() => {
        const message = intl.t('signup.success');
        flashMessages.success(message);
      }, (reason) => {
        if (intl.exists('errors.' + reason)) {
          var message = intl.t('errors.' + reason);
        } else {
          var message = intl.t('signup.unknown-error');
        }
        flashMessages.danger(message);
      });
    }
  }
});
