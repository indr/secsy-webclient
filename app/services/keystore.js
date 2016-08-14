import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  /**
   * Uploads a key to the key server and adds the key to the session.
   *
   * @param {String} userId
   * @param {String} emailAddress
   * @param {{privateKeyArmored, publicKeyArmored, key}} key
   * @return {Promise<{Key}>}
   */
  save(userId, emailAddress, key) {
    const session = this.get('session');
    const store = this.get('store');
    
    return store.findRecord('user', userId).then((user) => {
      user.set('privateKey', key.privateKeyArmored);
      user.set('publicKey', key.publicKeyArmored);
      return user.save();
    }).then(() => {
      session.set('data.authenticated.publicKey', key.publicKeyArmored);
      session.set('data.authenticated.privateKey', key.privateKeyArmored);
    }).then(() => {
      return key.key;
    });
  },
  
  /**
   * Retrieves the private key from session data.
   *
   * @returns {Key}
   */
  getPrivateKey() {
    const armored = this.get('session.data.authenticated.privateKey');
    if (!armored) {
      throw new Error('private-key-not-found');
    }
    
    const openpgp = this.get('openpgp');
    const result = openpgp.key.readArmored(armored);
    if (result.keys.length === 0) {
      throw new Error(result.err[0].message);
    }
    return result.keys[0];
  },
  
  /**
   * Looks for a public key for the given email address.
   *
   * @param emailAddress
   * @returns {Promise}
   */
  getPublicKey(emailAddress) {
    const filter = {emailAddress: emailAddress.toLowerCase()};
    
    return this._queryKey('key', filter);
  },
  
  _queryKey(type, filter) {
    return this.get('store').queryRecord(type, filter).then((record) => {
      if (!record) {
        throw new Error(type + '-not-found');
      }
      return record.get('armored');
    });
  }
});
