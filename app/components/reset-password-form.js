import Ember from 'ember';

const {
  $
} = Ember;

function debug (message) {
  Ember.debug('[component:reset-password-form] ' + message);
}

export default Ember.Component.extend({
  jQuery: $,
  
  actions: {
    reset() {
      const model = this.get('model');
      
      debug('Resetting password ' + model.token);
      
      const options = {
        url: '/api/users/reset-password',
        data: JSON.stringify(model),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json'
      };
      
      const flash = this.get('flashMessages');
      const sendAction = this.sendAction.bind(this, 'resetted');
      
      flash.clearMessages();
      this.jQuery.ajax(options).then(() => {
        flash.successT('reset.success');
        Ember.run.later(sendAction, 1500);
      }, function (jqXHR) {
        const reason = jqXHR.responseJSON ? jqXHR.responseJSON.message : '';
        flash.dangerT('reset.unknown-error', reason, {sticky: true});
      });
    }
  }
});
