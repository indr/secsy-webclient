import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  
  /**
   * Uploads a key to the key server and adds the key to the keychain.
   *
   * TODO: Supply email address
   *
   * @param {String} userId
   * @param {String} emailAddress
   * @param {{privateKeyArmored, publicKeyArmored, key}} key
   * @return {Promise<{Key}>}
   */
  save(userId, emailAddress, key) {
    const store = this.get('store');
    
    return store.createRecord('public-key', {
      userId: userId,
      emailAddress: emailAddress,
      armored: key.publicKeyArmored
    }).save().then(() => {
      return store.createRecord('private-key', {
        userId: userId,
        armored: key.privateKeyArmored
      }).save().then(() => {
        return key.key;
      });
    });
  },
  
  /**
   * TODO: Rename to getPrivateKey()
   *
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
  
  /**
   * Looks for a public key for the given email address.
   *
   * @param emailAddress
   * @returns {Promise}
   */
  getPublicKey(emailAddress) {
    const filter = {emailAddress: emailAddress};
    
    return this._queryKey('public-key', filter);
  },
  
  _queryKey(type, filter) {
    const self = this;
    
    const store = self.get('store');
    
    return store.queryRecord(type, filter).then((record) => {
      if (!record) {
        throw new Error(type + '-not-found');
      }
      return record.get('armored');
    });
  }
});
