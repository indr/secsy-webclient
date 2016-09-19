import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[component:app-search] ' + message);
// }

export default Ember.Component.extend({
  addressbook: Ember.inject.service(),
  
  keyUp(evnt) {
    if (evnt.keyCode === 27) {
      this.set('addressbook.searchQuery', null);
      this.sendAction('close');
    }
  },
  
  actions: {
    close() {
      this.set('addressbook.searchQuery', null);
      this.sendAction('close');
    }
  }
});
