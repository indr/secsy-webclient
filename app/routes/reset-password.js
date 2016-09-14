import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:reset-password] ' + message);
}

export default Ember.Route.extend({
  model(params) {
    debug('params.token: ' + params.token);
    
    return {token: params.token}
  },
  
  actions: {
    didTransition() {
      this.send('modalOpened');
    },
    
    resetted() {
      this.transitionTo('login')
    }
  }
});
