import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  
  canShare: Ember.computed('session.data.authenticated.sync_enabled', function () {
    return this.get('session').get('data.authenticated.sync_enabled');
  }),
  
  actions: {
    delete(model) {
      this.sendAction('delete', model);
    },
    
    share(model) {
      this.sendAction('share', model)
    }
  }
});
