import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  
  /**
   * Uploads a key to the key server and adds the key to the keychain.
   *
   * @param {String} userId
   * @param {{privateKeyArmored, publicKeyArmored, key}} key
   * @return {Promise<{Key}>}
   */
  save(userId, key) {
    const store = this.get('store');
    
    return store.createRecord('public-key', {
      userId: userId,
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
   *
   * @param userId
   * @returns {Promise.<String[]>}
   */
  load(userId) {
    // console.log('loading:', userId);
    const self = this;
    
    const filter = {userId: userId};
    
    const promises = [];
    promises.push(self._queryKey('public-key', filter));
    promises.push(self._queryKey('private-key', filter));
    
    return RSVP.all(promises);
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
