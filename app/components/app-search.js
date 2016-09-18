import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[component:app-search] ' + message);
// }

export default Ember.Component.extend({
  actions: {
    close() {
      this.set('searchQuery', null);
      this.sendAction('close');
    }
  }
});
