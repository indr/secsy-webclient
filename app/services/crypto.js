import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  
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
      resolve(self.encrypt(obj));
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
    return new RSVP.Promise((resolve) => {
      resolve(self.decrypt(obj));
    });
  },
  
  encodeBase64(obj) {
    return window.btoa(JSON.stringify(obj));
  },
  
  decodeBase64(text) {
    return JSON.parse(window.atob(text));
  }
});
