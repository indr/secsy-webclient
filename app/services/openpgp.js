import Ember from 'ember';
import openpgp from 'openpgp';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    
    openpgp.initWorker({path: 'assets/openpgp.worker.min.js'});
    
    this.decrypt = openpgp.decrypt;
    this.decryptKey = openpgp.decryptKey;
    this.encrypt = openpgp.encrypt;
    this.key = openpgp.key;
    this.message = openpgp.message;
  },
  
  /**
   * @param {String} emailAddress
   * @param {String} passphrase
   * @param {Number} numBits
   * @returns {Promise<Object>}
   * The generated key object in the form:
   * { key:String, privateKeyArmored:String, publicKeyArmored: String }
   */
  generateKey(emailAddress, passphrase, numBits) {
    const options = {
      userIds: [{email: emailAddress}],
      numBits: numBits || 4096,
      passphrase
    };
    if (options.numBits < 4096) {
      console.log('Generating key with less than 4096 bits');
    }
    return openpgp.generateKey(options);
  }
});
