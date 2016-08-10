import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  keychain: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  
  /**
   * Encrypts `obj` with default algorithm.
   *
   * @async
   * @param {Object} obj
   * @param {Object} key
   * @returns {Promise}
   * {{algorithm: string, data: string}}
   */
  encrypt(obj, key) {
    const self = this;
    return self.encodeBase64(obj).then((encoded) => {
      if (!key) {
        const keychain = self.get('keychain');
        key = keychain.getPrivateKey();
      }
      const options = {
        data: encoded,
        publicKeys: key,
        armor: true
      };
      const openpgp = self.get('openpgp');
      return openpgp.encrypt(options).then((encrypted) => {
        return {
          algorithm: 'base64.pgp',
          data: encrypted.data
        };
      });
    }).catch(() => {
      throw new Error('encryption-failed');
    });
  },
  
  /**
   * Decrypts `obj` based on the `algorithm` string.
   *
   * @async
   * @param {{algorithm: string, data: string}} obj
   * @returns {Object}
   */
  decrypt(obj, key) {
    const self = this;
    
    if (obj.algorithm === 'base64') {
      return self.decodeBase64(obj.data);
    }
    
    if (obj.algorithm === 'base64.pgp') {
      if (!key) {
        const keychain = self.get('keychain');
        key = keychain.getPrivateKey();
      }
      const openpgp = self.get('openpgp');
      const options = {
        message: openpgp.message.readArmored(obj.data),
        privateKey: key,
        format: 'utf8'
      };
      return openpgp.decrypt(options).then((message) => {
        return self.decodeBase64(message.data);
      });
    }
    throw new Error('Unknown algorithm');
  },
  
  /**
   * Encodes `obj` and returns base64 encoded {String}
   * @param {Object} obj
   * @returns {Promise}
   */
  encodeBase64(obj)
  {
    return new RSVP.Promise((resolve) => {
      resolve(window.btoa(JSON.stringify(obj)));
    });
  },
  
  /**
   * Decodes base64 `text` and returns an {Object}
   * @param text
   * @returns {Promise}
   */
  decodeBase64(text)
  {
    return new RSVP.Promise((resolve) => {
      resolve(JSON.parse(window.atob(text)));
    });
  }
});
