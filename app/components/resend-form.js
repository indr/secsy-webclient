import Ember from 'ember';
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

export default Ember.Component.extend(Validations, ValidationErrorsMixin, {
  ajax: Ember.inject.service(),
  
  showSuccess: false,
  email: null,
  
  actions: {
    resend() {
      const flash = this.get('flashMessages');
      const email = this.get('email');
      
      flash.clearMessages();
      
      this.get('ajax').post('/api/users/resend', {email}).then(() => {
        this.set('showSuccess', true);
      }).catch((error) => {
        return this.handleValidationErrors(error);
      }).catch((error) => {
        flash.dangerT('resend.unknown-error', error.getMessage(), {sticky: true})
      });
    }
  }
});
