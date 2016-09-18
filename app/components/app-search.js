import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[component:app-search] ' + message);
// }

export default Ember.Component.extend({
  addressbook: Ember.inject.service(),
  
  actions: {
    close() {
      this.set('addressbook.searchQuery', null);
      this.sendAction('close');
    }
  }
});
