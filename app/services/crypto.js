import Ember from 'ember';

export default Ember.Service.extend({
  keychain: Ember.inject.service('keychain'),

  encrypt(obj) {
    const keychain = this.get('keychain');
    console.log('public key', keychain.publicKey);

    return window.btoa(JSON.stringify(obj));
  },

  decrypt(base64) {
    const keychain = this.get('keychain');
    console.log('private key', keychain.privateKey);

    return JSON.parse(window.atob(base64));
  }
});
