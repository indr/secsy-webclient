import Ember from 'ember';
import openpgp from 'openpgp';

const {RSVP} = Ember;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  crypto: Ember.inject.service(),
  
  // TODO:
  // 1. Check contact is 'me'
  // 2. Get contacts public keys
  // 3. For each public key
  // 4. Encrypt and post a share
  share(contact) {
    return new RSVP.Promise((resolve, reject) => {
      return this.getPublicKeys().then((result) => {
        // console.log('public keys found %d', result.length, result);
        const promises = [];
        for (var i = 0; i < result.length; i++) {
          const eachPublicKey = result[i];
          if (eachPublicKey.emailAddress === contact.get('emailAddress$')) {
            // console.log('skipping own public key, %s', eachPublicKey.emailAddress);
            continue;
          }
          // console.log('share for ' + eachPublicKey.emailAddress);
          
          const key = openpgp.key.readArmored(eachPublicKey.armored).keys[0];
          
          // console.log('his key', key);
          promises.push(this._share(contact, eachPublicKey.emailAddress, key));
        }
        
        RSVP.allSettled(promises).then((/*promises*/) => {
          // console.log(promises);
          resolve('shared');
        }).catch((err) => {
          reject(err);
        });
      });
    });
  },
  
  getPublicKeys() {
    return new RSVP.Promise((resolve) => {
      // console.log('asking store', this.get('store'));
      this.get('store').findAll('contact').then((contacts) => {
        const array = contacts.toArray();
        const promises = [];
        for (var i = 0; i < array.length; i++) {
          const emailAddress = array[i].get('emailAddress$');
          if (!emailAddress) {
            continue;
          }
          promises.push(this.getPublicKey(emailAddress));
        }
        
        RSVP.allSettled(promises).then((promises) => {
          const result = [];
          for (var i = 0; i < promises.length; i++) {
            const each = promises[i];
            if (each.state === 'fulfilled' && each.value) {
              result.push(each.value);
            }
          }
          resolve(result);
        });
      });
    });
  },
  
  getPublicKey(emailAddress) {
    const keystore = this.get('keystore');
    return keystore.getPublicKey(emailAddress).then((armored) => {
      return {
        emailAddress,
        armored
      };
    });
  },
  
  _share(contact, toEmailAddress, key) {
    const crypto = this.get('crypto');
    return crypto.encrypt(contact, key).then((encrypted) => {
      // console.log('encrypted for ' + toEmailAddress, encrypted);
      const share = this.get('store').createRecord('share');
      share.set('for', toEmailAddress.toLowerCase());
      share.set('algorithm', encrypted.algorithm);
      share.set('encrypted', encrypted.data);
      // console.log('share to %s', toEmailAddress, share);
      return share.save().then(() => {
        console.log('share saved');
        return 'ok';
      });
    });
  }
  
});
