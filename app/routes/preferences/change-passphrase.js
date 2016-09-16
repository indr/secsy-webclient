import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    changed() {
      this.transitionTo('preferences');
    },
    
    didTransition() {
      this.send('modalOpened');
    }
  }
});
