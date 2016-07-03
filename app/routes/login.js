import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    loggedIn() {
      this.transitionTo('contacts');
    }
  }
});
