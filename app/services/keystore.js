import Ember from 'ember';

export default Ember.Service.extend({
  crypto: Ember.inject.service(),
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
    return this.get('store').createRecord('key', {
      isPublic: true,
      publicKey: key.publicKeyArmored,
      privateKey: key.privateKeyArmored
    }).save().then(() => {
      const session = this.get('session');
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
  
  hasPrivateKey() {
    return !!this.get('session.data.authenticated.private_key');
  },
  
  /**
   * Looks for a public key for the given email address.
   *
   * @param emailAddress
   * @returns {Promise} Resolves with a key or undefined.
   */
  getPublicKey(emailAddress) {
    const hash = this.get('crypto').hashEmail(emailAddress);
    const filter = {h: hash};
    
    return this.get('store').query('key', filter).then((results) => {
      return results.objectAt(0);
    });
  },
  
  changePassphrase(options) {
    return this.get('store').findRecord('key', 'my').then((key) => {
      const openpgp = this.get('openpgp');
      const result = openpgp.key.readArmored(key.get('privateKey'));
      if (result.keys.length === 0) {
        throw new Error(result.err[0].message)
      }
      const privateKey = result.keys[0];
      
      return openpgp.decryptKey({
        privateKey: privateKey,
        passphrase: options.passphrase
      }).then((result) => {
        const key = result.key;
        key.primaryKey.encrypt(options.newPassphrase);
        key.subKeys[0].subKey.encrypt(options.newPassphrase);
        return key.armor();
      }).then((armored) => {
        key.privateKey = armored;
        return key.save();
      });
    });
  }
});
