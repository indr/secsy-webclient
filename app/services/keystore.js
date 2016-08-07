import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  
  /**
   * Uploads a key to the key server and adds the key to the keychain.
   *
   * @param userId
   * @param key
   * @return {Promise<Key>}
   */
  save(userId, key) {
    console.log('saving:', key);
    const self = this;
    
    const store = this.get('store');
    
    return store.createRecord('public-key', {
      userId: userId,
      armored: key.publicKeyArmored
    }).save().then((publicKey) => {
      self.publicKey = publicKey;
      return store.createRecord('private-key', {
        userId: userId,
        armored: key.privateKeyArmored
      }).save().then((privateKey) => {
        self.privateKey = privateKey;
        return key.key;
      });
    });
  },
  
  /**
   *
   * @param userId
   * @returns {Promise.<Key[]>}
   */
  load(userId) {
    console.log('loading:', userId);
    const self = this;
    
    const store = self.get('store');
    const filter = {userId: userId};
    
    return store.queryRecord('public-key', filter).then((record) => {
      console.log('publicKey', record);
      if (!record) {
        throw new Error('public-key-not-exist');
      }
      self.publicKey = record;
      return store.queryRecord('private-key', filter);
    }).then((record) => {
      console.log('privateKey', record);
      if (!record) {
        throw new Error('private-key-not-exist');
      }
      self.privateKey = record;
    });
  }
});
