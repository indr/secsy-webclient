import Ember from 'ember';
import openpgp from 'openpgp';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  keyring: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    
    openpgp.initWorker({path: 'assets/openpgp.worker.min.js'});
  },
  
  /**
   * Encrypts `obj` with default algorithm.
   *
   * @async
   * @param {Object} obj
   * @returns {{algorithm: string, data: string}}
   */
  encrypt(obj) {
    const self = this;
    return new RSVP.Promise((resolve) => {
      const passphrase = self.get('keyring').getPassphrase();
      const options = {
        data: self.encodeBase64(obj),
        passwords: passphrase,
        armor: true
      };
      openpgp.encrypt(options)
        .then((encrypted) => {
          const result = {
            algorithm: 'base64.pgp',
            data: encrypted.data
          };
          resolve(result);
        });
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
        const passphrase = self.get('keyring').getPassphrase();
        const options = {
          password: passphrase,
          message: openpgp.message.readArmored(obj.data)
        };
        openpgp.decrypt(options)
          .then((message) => {
            resolve(self.decodeBase64(message.data));
          })
          .catch((err) => {
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
  }
});
