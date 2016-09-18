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
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, ValidationErrorsMixin, {
  ajax: Ember.inject.service(),
  
  showSuccess: false,
  email: null,
  
  actions: {
    sendReset() {
      const flash = this.get('flashMessages');
      const email = this.get('email');
      
      flash.clearMessages();
      
      this.track('sendResetState', this.get('ajax').post('/api/users/forgot-password', {email})).then(() => {
        this.set('showSuccess', true);
      }).catch((error) => {
        return this.handleValidationErrors(error)
      }).catch((error) => {
        flash.dangerT('forgot.unknown-error', error.getMessage(), {sticky: true});
      });
    }
  }
});
