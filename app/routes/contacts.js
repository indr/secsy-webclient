import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  addressbook: Ember.inject.service('addressbook'),

  model() {
    return this.get('addressbook').getContacts();
  }
});
