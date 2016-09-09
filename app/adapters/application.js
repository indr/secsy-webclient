import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  session: Ember.inject.service(),
  
  namespace: 'api',
  
  /**
   * AdonisJs uses [Indicative](http://indicative.adonisjs.com/) to validate user input. The returned payload has
   * this format:
   *
   * ```js
   * payload = [
   *   { field: 'email', message: 'email validation failed on email', validation: 'email' },
   *   { field: 'email', message: 'min validation failed on email', validation: 'min' },
   *   { field: 'password', message: 'required validation failed on password', validation: 'required' }
   * ]
   * ```
   *
   * The payload is always an array even if only one validation fails or the validation
   * is invoked with `validateAll()`.
   *
   * @param status
   * @param headers
   * @param payload
   * @returns {Array}
   */
  normalizeErrorResponse(status, headers, payload) {
    const errors = [];
    
    const fields = payload.fields;
    if (fields && Array.isArray(fields)) {
      for (var i = 0; i < fields.length; i++) {
        const each = fields[i];
        const pointer = 'data/attributes/' + each.field;
        const validation = this.normalizeErrorAttributeValidation(each);
        errors.push({
          detail: validation,
          source: {pointer}
        });
      }
    }
    
    if (errors.length === 0 || errors.message) {
      errors.push({
        status: `${payload.status || status}`,
        title: payload.message || 'The backend responded with an error',
        detail: `${payload}`
      });
    }
    return errors;
  },
  
  normalizeErrorAttributeValidation(error) {
    if (error.validation === 'unique') {
      return 'unique-' + error.field;
    }
    return error.validation;
  }
});
