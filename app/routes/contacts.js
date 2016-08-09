import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
import ENV from 'addressbook/config/environment';
import KeychainOpenedRouteMixin from '../mixins/keychain-opened-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, KeychainOpenedRouteMixin, {
  session: Ember.inject.service(),
  
  model() {
    return this.get('store').findAll('contact').then((contacts) => {
      if (ENV.APP.autoCreateMe) {
        var me = contacts.findBy('me', true);
        if (!me) {
          const emailAddress = this.get('session.data.authenticated.email');
          me = this.get('store').createRecord('contact');
          me.set('me', true);
          me.set('name$', 'Me');
          me.set('emailAddress$', emailAddress);
          me.save();
        }
      }
      return contacts;
    });
  }
});
