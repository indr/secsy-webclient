import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  keychain: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  session: Ember.inject.service(),
  
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
        return 'base64.pgp///' + encrypted.data;
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
   * @param key Private key
   * @returns {Object}
   */
  decrypt(obj, key) {
    const self = this;
    
    var parts = obj.split('///');
    const algorithm = parts[0];
    const cypher = parts[1];
    if (algorithm === 'base64') {
      return self.decodeBase64(cypher);
    }
    
    if (algorithm === 'base64.pgp') {
      if (!key) {
        const keychain = self.get('keychain');
        key = keychain.getPrivateKey();
      }
      const openpgp = self.get('openpgp');
      const options = {
        message: openpgp.message.readArmored(cypher),
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
  },
  
  hashEmail(emailAddress) {
    const salt = this.get('session').get('data.authenticated.hash_salt');
    emailAddress = emailAddress.toLowerCase();
    return this.get('openpgp').sha256(salt + emailAddress);
  }
});
