import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import KeyringOpenedRouteMixin from '../mixins/keyring-opened-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, KeyringOpenedRouteMixin, {
  addressbook: Ember.inject.service('addressbook'),

  model() {
    return this.get('addressbook').getContacts();
  }
});
