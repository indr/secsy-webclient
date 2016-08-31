import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UndecryptedRouteMixin from './../mixins/undecrypted-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, UndecryptedRouteMixin, {
  actions: {
    didTransition() {
      this.send('modalOpened');
    }
  }
});
