import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  
  canSearch: false,
  isSearchVisible: false,
  
  isSearchItemVisible: Ember.computed('canSearch', 'isSearchVisible', function () {
    return this.get('canSearch') && !this.get('isSearchVisible');
  }),
  
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    openSearch() {
      this.sendAction('openSearch');
    }
  }
});
