import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  crypto: Ember.inject.service(),
  keyring: Ember.inject.service(),
  
  properties: ['phoneNumber', 'emailAddress'],
  
  serialize(/*snapshot, options*/) {
    this._ensureOpenKeyring();
    
    const json = this._super(...arguments);
    const properties = this.get('properties');
    const crypto = this.get('crypto');
    
    const unencrypted = Ember.getProperties(json, properties);
    properties.forEach((key) => delete json[key]);
    json.encrypted = crypto.encrypt(unencrypted);
    
    return json;
  },
  
  normalize(typeClass, hash) {
    this._ensureOpenKeyring();
  
    const crypto = this.get('crypto');
    
    if (hash.encrypted) {
      const decrypted = crypto.decrypt(hash.encrypted);
      delete hash['encrypted'];
      Ember.merge(hash, decrypted);
    }
      
    return this._super(...arguments);
  },
  
  _ensureOpenKeyring() {
    Ember.assert('Unable to serialize and/or deserialize contacts. Keychain is not open',
      this.get('keyring.isOpen') === true);
  }
});
