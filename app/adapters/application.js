import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  session: Ember.inject.service(),
  
  namespace: 'api',
  
  headers: Ember.computed('session.data.authenticated.token', function () {
    const key = 'X-Auth-Token';
    var token = this.get('session.data.authenticated.token');
    Ember.Logger.info(key, token);
    if (Ember.isPresent(token)) {
      const headers = {};
      headers[key] = token;
      return headers;
    }
  }),
  
  normalizeErrorResponse(status, headers, payload) {
    const errors = [];
    
    if (payload && typeof payload === 'object') {
      if (payload.invalidAttributes) {
        Object.keys(payload.invalidAttributes).forEach(function (eachKey) {
          const pointer = 'data/attributes/' + eachKey;
          payload.invalidAttributes[eachKey].forEach(function (obj) {
            errors.push({
              detail: obj.message,
              source: {pointer}
            });
          });
        });
      }
    }
    
    if (errors.length === 0 || errors.message) {
      errors.push({
        status: `${status}`,
        title: payload.message || 'The backend responded with an error',
        detail: `${payload}`
      });
    }
    console.log('errors', errors);
    return errors;
  }
});
