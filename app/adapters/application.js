import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  session: Ember.inject.service(),
  
  namespace: 'api',
  
  headers: Ember.computed('session.data.authenticated.token', function () {
    var token = this.get('session.data.authenticated.token');
    if (!Ember.isPresent(token)) {
      return {
        'X-Auth-Token': token
      };
    }
  })
});
