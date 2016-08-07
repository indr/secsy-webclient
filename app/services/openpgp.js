import Ember from 'ember';
import openpgp from 'openpgp';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    
    openpgp.initWorker({path: 'assets/openpgp.worker.min.js'});
    
    this.decrypt = openpgp.decrypt;
    this.encrypt = openpgp.encrypt;
    this.key = openpgp.key;
    this.message = openpgp.message;
  },
  
  /**
   * @param {String} emailAddress
   * @param {String} passphrase
   * @returns {Promise<Object>}
   * The generated key object in the form:
   * { key:String, privateKeyArmored:String, publicKeyArmored: String }
   */
  generateKey(emailAddress, passphrase) {
    const options = {
      userIds: [{email: emailAddress}],
      numBits: 4096,
      passphrase
    };
    return openpgp.generateKey(options);
  }
});
