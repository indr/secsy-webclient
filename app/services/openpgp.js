/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import ENV from 'secsy-webclient/config/environment';
import openpgp from 'openpgp';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    
    if (ENV.useWebWorker) {
      openpgp.initWorker({path: 'assets/openpgp.worker.min.js'});
    }
    
    this.decryptKey = openpgp.decryptKey;
    this.encrypt = openpgp.encrypt;
    this.key = openpgp.key;
    this.message = openpgp.message;
  },
  
  decrypt() {
    return new RSVP.Promise((resolve, reject) => {
      openpgp.decrypt(...arguments).then(resolve).catch(reject);
    })
  },
  
  encrypt() {
    return new RSVP.Promise((resolve, reject) => {
      openpgp.decrypt(...arguments).then(resolve).catch(reject);
    })
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
    return new RSVP.Promise((resolve, reject) => {
      openpgp.generateKey(options).then(resolve).catch(reject);
    });
  },
  
  /**
   * Returns sha256 hash of data.
   *
   * @param data
   * @returns {String}
   */
  sha256(data) {
    var u8a = openpgp.crypto.hash.sha256(data);
    return this._bytesToString(u8a);
  },
  
  _bytesToString(bytes) {
    var result = '';
    for (var i = 0; i < bytes.length; i++) {
      var s = bytes[i].toString(16);
      result = result + (bytes[i] < 0x10 ? '0' + s : s);
    }
    return result;
  }
});
