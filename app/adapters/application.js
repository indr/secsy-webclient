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
  })
});
