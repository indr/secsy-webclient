import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  
  canPullUpdates: Ember.computed('session.data.authenticated.sync_enabled', function () {
    return this.get('session').get('data.authenticated.sync_enabled');
  })
});
