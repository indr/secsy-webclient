import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  senecaAuth: Ember.inject.service(),
  
  /**
   * Uploads a key to the key server anselfd adds the key to the keychain.
   *
   * TODO: Supply email address
   *
   * @param {String} userId
   * @param {String} emailAddress
   * @param {{privateKeyArmored, publicKeyArmored, key}} key
   * @return {Promise<{Key}>}
   */
  save(userId, emailAddress, key) {
    const session = this.get('session');
    const store = this.get('store');
    const senecaAuth = this.get('senecaAuth');
    
    return store.createRecord('public-key', {
      userId: userId,
      emailAddress: emailAddress.toLowerCase(),
      armored: key.publicKeyArmored
    }).save().then(() => {
      return store.createRecord('private-key', {
        userId: userId,
        armored: key.privateKeyArmored
      }).save().then(() => {
        return senecaAuth.updateUser(null, null, null, emailAddress, {
          privateKey: key.privateKeyArmored,
          publicKey: key.publicKeyArmored
        }).then(() => {
          session.set('data.authenticated.user.publicKey', key.publicKeyArmored);
          session.set('data.authenticated.user.privateKey', key.privateKeyArmored);
        });
      }).then(() => {
        return key.key;
      });
    });
  },
  
  /**
   * Deprecated. Use getPrivateKey
   * @param userId
   * @returns {Promise.<String[]>}
   */
  load(userId) {
    const filter = {userId: userId};
    
    const promises = [];
    promises.push(this._queryKey('public-key', filter));
    promises.push(this._queryKey('private-key', filter));
    
    return RSVP.all(promises);
  },
  
  getPrivateKey(userId) {
    return this._queryKey('private-key', {userId: userId});
  },
  
  /**
   * Looks for a public key for the given email address.
   *
   * @param emailAddress
   * @returns {Promise}
   */
  getPublicKey(emailAddress) {
    const filter = {emailAddress: emailAddress.toLowerCase()};
    
    return this._queryKey('public-key', filter);
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
