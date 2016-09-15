import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMix from './../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMix, {
  addressbook: Ember.inject.service(),
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),
  
  model() {
    const email = this.get('session').get('data.authenticated.email');
    return Ember.Object.create({
      email
    });
  },
  
  actions: {
    
    deleteAccount() {
      console.log('delete account');
    },
    
    sendPasswordResetEmail() {
      const flash = this.get('flashMessages');
      const email = this.controller.get('model.email');
      
      flash.clearMessages();
      
      this.get('ajax').post('/api/users/forgot-password', {email}).then(() => {
        flash.successT('profile.reset-email.success');
      }).catch((error) => {
        flash.dangerT('profile.reset-email.unknown-error', error.getMessage() || error, {sticky: false});
      });
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
