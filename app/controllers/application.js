import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[controller:application] ' + message);
// }

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  noSsl: window.location.href.indexOf('https') !== 0 && window.location.href.indexOf('http://localhost') !== 0,
  
  isModal: false,
  
  isSearchOpen: false,
  
  canSearch: Ember.computed('currentPath', function () {
    const currentPath = this.get('currentPath');
    return (currentPath === 'contacts.index') || (currentPath.indexOf('map') === 0);
  }),
  
  isSearchVisible: Ember.computed.and('isSearchOpen', 'canSearch'),
  
  progress: {value: 0, max: 0, type: 'info'},
  
  openSearch() {
    if (!this.get('canSearch')) {
      return;
    }
    this.set('isSearchOpen', true);
  },
  
  closeSearch() {
    this.set('isSearchOpen', false);
  }
});
