import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  
  actions: {
    activate() {
      const flash = this.get('flashMessages');
      const token = this.token;
      const sendAction = this.sendAction.bind(this, 'activated');
      
      flash.clearMessages();
      this.get('ajax').post('/api/users/confirm', {token}).then(() => {
        flash.successT('activate.success');
        Ember.run.later(sendAction, 1500);
      }).catch((error) => {
        flash.dangerT('activate.unknown-error', error.getMessage(), {sticky: true});
      });
    }
  }
});
