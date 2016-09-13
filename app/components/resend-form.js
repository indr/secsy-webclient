import Ember from 'ember';

const {
  $
} = Ember;

export default Ember.Component.extend({
  jQuery: $,
  
  showSuccess: false,
  
  actions: {
    resend() {
      const email = this.email;
      
      const options = {
        url: '/api/users/resend',
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
        flash.dangerT('resend.unknown-error', reason, {sticky: true})
      })
    }
  }
});
