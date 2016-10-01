/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

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
  },
});

export default Ember.Component.extend(TrackerMixin, Validations, ValidationErrorsMixin, {
  ajax: Ember.inject.service(),
  
  password: null,
  
  actions: {
    reset() {
      const flash = this.get('flashMessages');
      const sendAction = this.sendAction.bind(this, 'resetted');
      
      const token = this.get('model').token;
      const password = this.get('password');
      
      flash.clearMessages();
      this.track('resetState', this.get('ajax').post('/api/users/reset-password', {token, password})).then(()=> {
        flash.successT('reset.success');
        Ember.run.later(sendAction, 1500);
      }).catch((error) => {
        return this.handleValidationErrors(error);
      }).catch((error) => {
        flash.dangerT('reset.unknown-error', error, {sticky: true});
      });
    }
  }
});
