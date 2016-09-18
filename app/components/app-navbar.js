import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    openSearch() {
      this.sendAction('openSearch');
    }
  }
});
