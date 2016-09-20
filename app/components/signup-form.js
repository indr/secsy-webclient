import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorsMixin from '../mixins/validation-errors-mixin';

const Validations = buildValidations({
  email: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'}),
      validator('ds-error')
    ]
  },
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64}),
      validator('ds-error')
    ]
  },
  confirmPassword: {
    validators: [
      validator('presence', true),
      validator('confirmation', {
        on: 'password', messageKey: 'errors.confirmation-password'
      })
    ]
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, ValidationErrorsMixin, {
  ajax: Ember.inject.service(),
  intl: Ember.inject.service(),
  
  email: null,
  password: null,
  confirmPassword: null,
  syncEnabled: false,
  
  showSuccess: false,
  
  actions: {
    signup() {
      const flash = this.get('flashMessages');
      const data = this.getProperties('email', 'password');
      data.sync_enabled = this.get('syncEnabled');
      data.locale = this.get('intl').get('locale')[0];
      
      flash.clearMessages();
      
      this.track('signupState', this.get('ajax').post('/api/users', data)).then(() => {
        this.set('showSuccess', true)
      }).catch((error) => {
        return this.handleValidationErrors(error, {username: 'email'});
      }).catch((error) => {
        flash.dangerT('signup.unknown-error', error.getMessage(), {sticky: true});
      });
    }
  }
});
