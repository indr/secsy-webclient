import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),
  
  actions: {
    deleteAccount() {
      const flash = this.get('flashMessages');
      const message = this.controller.get('deleteMessage');
      
      flash.clearMessages();
      
      this.get('ajax').delete('/api/users/me', {message}).then(() => {
        flash.successT('profile.delete-account.success');
        Ember.run.later(() => {
          this.get('session').invalidate();
        }, 1500);
      }).catch((error) => {
        flash.dangerT('profile.delete-account.unknown-error', error.getMessage() || error, {sticky: false});
      });
    }
  }
});
