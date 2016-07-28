import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    signedUp() {
      this.transitionTo('login');
    }
  }
});
