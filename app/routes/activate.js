import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:activate] ' + message);
}

export default Ember.Route.extend({
  model(params) {
    debug('params.token: ' + params.token);
    
    return params.token
  },
  
  actions: {
    activated() {
      this.transitionTo('login');
    },
    
    didTransition() {
      this.send('modalOpened');
    }
  }
});
