import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
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
  },
  
  keyboardShortcuts: {
    'ctrl+f': 'openSearch',
    '/': 'openSearch'
  }
});
