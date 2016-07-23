import Ember from 'ember';

export default Ember.Service.extend({
  
  encrypt(obj) {
    return window.btoa(JSON.stringify(obj));
  },

  decrypt(base64) {
    return JSON.parse(window.atob(base64));
  }
});
