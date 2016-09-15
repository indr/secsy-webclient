import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMix from './../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMix, {
  addressbook: Ember.inject.service(),
  
  actions: {
    deleteAccount() {
      console.log('delete account');
    },
    
    sendPasswordResetEmail() {
      console.log('send password reset email');
    },
    
    generateFakes() {
      const progress = this.send.bind(this, 'onProgress');
      return this.get('addressbook').fake(progress);
    },
    
    deleteAll() {
      const progress = this.send.bind(this, 'onProgress');
      return this.get('addressbook').clear(progress);
    }
  }
});
