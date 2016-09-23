import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorsMixin from '../mixins/validation-errors-mixin';

const Validations = buildValidations({
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64}),
      validator('ds-error')
    ]
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, ValidationErrorsMixin, {
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),
  
  message: null,
  password: null,
  
  actions: {
    deleteAccount() {
      const flash = this.get('flashMessages');
      const {message, password} = this.getProperties('message', 'password');
      
      flash.clearMessages();
      
      this.track('deleteAccountState', this.get('ajax').delete('/api/users/me', {message, password})).then(() => {
        flash.successT('profile.delete-account.success');
        Ember.run.later(() => {
          this.get('session').invalidate();
        }, 1500);
      }).catch((error) => {
        return this.handleValidationErrors(error);
      }).catch((error) => {
        flash.dangerT('profile.delete-account.unknown-error', error, {sticky: false});
      });
    }
  }
});
