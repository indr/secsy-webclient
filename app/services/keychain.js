import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  privateKey: null,
  publicKey: null,

  open(/*passphrase*/) {
    this.set('privateKey', 'priv key 123' );
    this.set('publicKey', 'public key ABC');
  },

  close() {
    this.set('privateKey', null);
  }
});
