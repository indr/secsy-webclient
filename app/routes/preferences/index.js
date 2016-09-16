import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:preferences/index] ' + message);
}

export default Ember.Route.extend({
  addressbook: Ember.inject.service(),
  ajax: Ember.inject.service(),
  
  actions: {
    savePreferences() {
      const flash = this.get('flashMessages');
      const model = this.controller.get('model');
      
      flash.clearMessages();
      
      this.get('ajax').patch('/api/users/me', {locale: model.locale}).then(() => {
        this.send('setLocale', model.locale)
      }).catch((error) => {
        flash.dangerT('profile.unknown-error', error.getMessage() || error);
      })
    },
    
    generateFakes() {
      const progress = this.send.bind(this, 'onProgress');
      return this.get('addressbook').fake(progress);
    },
    
    deleteAll() {
      const progress = this.send.bind(this, 'onProgress');
      return this.get('addressbook').clear(progress);
    },
    
    sendPasswordResetEmail() {
      const flash = this.get('flashMessages');
      const email = this.controller.get('model.email');
      
      debug('send password reset for ' + email);
      
      flash.clearMessages();
      
      this.get('ajax').post('/api/users/forgot-password', {email}).then(() => {
        flash.successT('profile.reset-email.success');
      }).catch((error) => {
        flash.dangerT('profile.reset-email.unknown-error', error.getMessage() || error, {sticky: false});
      });
    }
  }
});
