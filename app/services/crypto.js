import Ember from 'ember';
import openpgp from 'openpgp';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  
  init() {
    this._super(...arguments);
    
    openpgp.initWorker({path: 'assets/openpgp.worker.min.js'});
  },
  
  /**
   * Encrypts `obj` with default algorithm.
   *
   * @param {Object} obj
   * @returns {{algorithm: string, data: string}}
   */
  encrypt(obj) {
    return {
      algorithm: 'base64',
      data: this.encodeBase64(obj)
    };
  },
  
  encryptAsync(obj) {
    const self = this;
    return new RSVP.Promise((resolve) => {
      const options = {
        data: self.encodeBase64(obj),
        passwords: '1234',
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
   * @param {{algorithm: string, data: string}} obj
   * @returns {Object}
   */
  decrypt(obj) {
    if (obj.algorithm === 'base64') {
      return this.decodeBase64(obj.data);
    }
    
    new Error('Unknown algorithm: ', obj.algorithm);
  },
  
  decryptAsync(obj) {
    const self = this;
    return new RSVP.Promise((resolve, reject) => {
      if (obj.algorithm === 'base64') {
        resolve(self.decodeBase64(obj.data));
      }
      else if (obj.algorithm === 'base64.pgp') {
        const options = {
          password: '1234',
          message: openpgp.message.readArmored(obj.data)
        };
        openpgp.decrypt(options)
          .then((message) => {
            resolve(self.decodeBase64(message.data));
          })
          .catch((err) => {
            reject(err);
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
