import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[controller:application] ' + message);
// }

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  noSsl: window.location.href.indexOf('https') !== 0 && window.location.href.indexOf('http://localhost') !== 0,
  
  isModal: false,
  isSearchVisible: false,
  
  progress: {value: 0, max: 0, type: 'info'},
  
  searchQuery: null,
  
  toggleSearch() {
    this.toggleProperty('isSearchVisible');
  }
});
