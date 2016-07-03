import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  contacts: null,

  init() {
    this._super(...arguments);
  },

  decrypt(/*passphrase*/) {
    const self = this;
    return this.get('store').findAll('contact')
      .then(function (contacts) {
        self.set('contacts', contacts);
      });
  },

  getContacts() {
    return this.get('contacts');
  }
});
