import Ember from 'ember';

const {
  $
} = Ember;

export default Ember.Component.extend({
  jQuery: $,
  
  showSuccess: false,
  email: null,
  
  actions: {
    sendReset() {
      const email = this.get('email');
      
      const options = {
        url: '/api/users/forgot-password',
        data: JSON.stringify({email}),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json'
      };
      
      const flash = this.get('flashMessages');
      
      flash.clearMessages();
      this.jQuery.ajax(options).then(() => {
        this.set('showSuccess', true);
      }, function (jqXHR) {
        const reason = jqXHR.responseJSON ? jqXHR.responseJSON.message : '';
        flash.dangerT('forgot.unknown-error', reason, {sticky: true})
      });
    }
  }
});
