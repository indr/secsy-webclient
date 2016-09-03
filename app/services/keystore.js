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
    const openpgp = this.get('openpgp');
    
    return store.createRecord('key', {
      isPublic: true,
      emailSha256: openpgp.sha256(emailAddress),
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored
    }).save().then(function () {
      session.set('data.authenticated.public_key', key.publicKeyArmored);
      session.set('data.authenticated.private_key', key.privateKeyArmored);
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
    const armored = this.get('session.data.authenticated.private_key');
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
   * @returns {Promise} Resolves with a key or undefined.
   */
  getPublicKey(emailAddress) {
    const hash = this.get('openpgp').sha256(emailAddress.toLowerCase());
    const filter = {h: hash};
    
    return this.get('store').query('key', filter).then((results) => {
      return results.objectAt(0);
    });
  }
});
