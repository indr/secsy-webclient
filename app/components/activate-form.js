import Ember from 'ember';

const {
  $
} = Ember;

function debug (message) {
  Ember.debug('[component:activate-form] ' + message);
}

export default Ember.Component.extend({
  jQuery: $,
  
  actions: {
    activate() {
      const token = this.token;
      
      debug('Activating token ' + token);
      
      const options = {
        url: '/api/users/confirm',
        data: JSON.stringify({token}),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json'
      };
      
      const flash = this.get('flashMessages');
      const sendAction = this.sendAction.bind(this, 'activated');
      
      flash.clearMessages();
      this.jQuery.ajax(options).then(function (/*data, textStatus, jqXHR*/) {
        flash.successT('activate.success');
        Ember.run.later(sendAction, 1500);
      }, function (jqXHR/*, textStatus, errorThrown*/) {
        const reason = jqXHR.responseJSON ? jqXHR.responseJSON.message : '';
        flash.dangerT('activate.unknown-error', reason, {sticky: true})
      })
    }
  }
});
