import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  openpgp: Ember.inject.service('openpgp'),

  privateKey: null,
  publicKey: null,

  open(/*passphrase*/) {
    const openpgp = this.get('openpgp');

    this.set('privateKey', 'priv key 123' );
    this.set('publicKey', 'public key ABC');
  },

  close() {
    this.set('privateKey', null);
  }
});
