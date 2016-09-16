import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMix from './../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMix, {
  session: Ember.inject.service(),
  
  model() {
    const email = this.get('session').get('data.authenticated.email');
    const locale = this.get('session').get('data.authenticated.locale');
    return Ember.Object.create({
      email,
      locale
    });
  }
});
