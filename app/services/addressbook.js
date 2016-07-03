import Ember from 'ember';

export default Ember.Service.extend({
  keychain: Ember.inject.service('keychain'),
  store: Ember.inject.service('store'),
  contacts: null,

  init() {
    this._super(...arguments);
  },

  decrypt(passphrase) {
    const keychain = this.get('keychain');
    keychain.open(passphrase);

    const self = this;
    return this.get('store').findAll('contact')
      .then(function (contacts) {
        self.set('contacts', contacts);
        keychain.close();
      })
      .catch(function () {
        keychain.close();
      });
  },

  getContacts() {
    return this.get('contacts');
  }
});
