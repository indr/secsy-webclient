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
   * @param {Boolean} unlocked
   * @returns {Promise<Object>}
   * The generated key object in the form:
   * { key:String, privateKeyArmored:String, publicKeyArmored: String }
   */
  generateKey(emailAddress, passphrase, numBits, unlocked) {
    const options = {
      userIds: [{email: emailAddress}],
      passphrase: passphrase,
      numBits: numBits || 4096,
      unlocked: unlocked
    };
    if (options.numBits < 4096) {
      console.log('Generating key with less than 4096 bits');
    }
    return openpgp.generateKey(options);
  }
});
