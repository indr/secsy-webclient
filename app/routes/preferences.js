import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  
  actions: {
    generateFakes() {
      console.log('TODO: generateFakes()');
    },
    
    deleteAll() {
      console.log('TODO: deleteAll()');
    }
  }
});
