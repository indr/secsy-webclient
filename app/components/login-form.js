import Ember from 'ember';
import {validator, buildValidations} from 'ember-cp-validations';

const Validations = buildValidations({
  username: validator('presence', true),
  password: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  session: Ember.inject.service(),
  intl: Ember.inject.service(),

  username: null,
  password: null,

  actions: {
    login() {
      const {flashMessages, intl} = this.getProperties('flashMessages', 'intl');
      const {username, password} = this.getProperties('username', 'password');

      this.get('session').authenticate('authenticator:seneca', username, password).then(() => {
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
