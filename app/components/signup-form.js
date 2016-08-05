import Ember from 'ember';
import {validator, buildValidations} from 'ember-cp-validations';

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
  flashMessages: Ember.inject.service(),
  intl: Ember.inject.service(),
  senecaAuth: Ember.inject.service(),

  emailAddress: null,
  password: null,
  passwordRepeat: null,

  actions: {
    signup() {
      const self = this;
      const {flashMessages, intl} = this.getProperties('flashMessages', 'intl');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');

      this.get('senecaAuth').register(emailAddress, password).then(() => {
        const message = intl.t('signup.success');
        flashMessages.success(message);
        self.sendAction('signedUp');
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
