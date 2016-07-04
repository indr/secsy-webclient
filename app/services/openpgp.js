import Ember from 'ember';
import openpgp from 'openpgp';

export default Ember.Service.extend({
  init() {
    console.log('crypto service - init');
    this._super(...arguments);

    openpgp.initWorker({ path: '/assets/openpgp.worker.js' });

    openpgp.config.aead_protected = true;
  },

  generateKeyPair(passphrase) {
    var options = {
      userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
      numBits: 4096,                                            // RSA key size
      passphrase: 'super long and hard to guess secret'         // protects the private key
    };

    openpgp.generateKey(options).then(function(key) {
      var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
      var pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

      console.log('privkey', privkey);
    });
  }
});
