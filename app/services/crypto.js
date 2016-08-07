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
   * @returns {{algorithm: string, data: string}}
   */
  encrypt(obj) {
    const passphrase = this.get('keychain').getPassphrase();
    const options = {
      data: this.encodeBase64(obj),
      passwords: passphrase,
      armor: true
    };
    const openpgp = this.get('openpgp');
    return openpgp.encrypt(options).then((encrypted) => {
      return {
        algorithm: 'base64.pgp',
        data: encrypted.data
      };
    });
  },
  
  /**
   * Decrypts `obj` based on the `algorithm` string.
   *
   * @async
   * @param {{algorithm: string, data: string}} obj
   * @returns {Object}
   */
  decrypt(obj) {
    const self = this;
    return new RSVP.Promise((resolve, reject) => {
      if (obj.algorithm === 'base64') {
        resolve(self.decodeBase64(obj.data));
      }
      else if (obj.algorithm === 'base64.pgp') {
        const passphrase = self.get('keychain').getPassphrase();
        const openpgp = self.get('openpgp');
        const options = {
          password: passphrase,
          message: openpgp.message.readArmored(obj.data)
        };
        openpgp.decrypt(options).then((message) => {
          resolve(self.decodeBase64(message.data));
        }).catch((err) => {
          reject(err = '{}\n' ? 'decryption-failed' : err);
        });
      }
      else {
        reject(new Error('unknown algorithm'));
      }
    });
  },
  
  encodeBase64(obj) {
    return window.btoa(JSON.stringify(obj));
  },
  
  decodeBase64(text) {
    return JSON.parse(window.atob(text));
  },
  
  // TODO: Move to service:openpgp
  generateKey(emailAddress, passphrase) {
    const self = this;
    return new RSVP.Promise((resolve, reject) => {
      const openpgp = self.get('openpgp');
      
      openpgp.generateKey(emailAddress, passphrase).then((key) => {
        resolve(key);
      }).catch((err) => {
        reject(err);
      });
    });
  }
});
