import Ember from 'ember';

const {RSVP} = Ember;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  
  // TODO:
  // 1. Check contact is 'me'
  // 2. Get contacts public keys
  // 3. For each public key
  // 4. Encrypt and post a share
  share(/*contact*/) {
    return new RSVP.Promise((resolve, reject) => {
      return this.getPublicKeys().then((result) => {
        for (var i = 0; i < result; i++) {
          console.log('share for ' + result[i].emailAddress);
        }
        console.log(result);
        reject('not implementet');
      });
    });
  },
  
  
  getPublicKeys() {
    return new RSVP.Promise((resolve) => {
      console.log('asking store', this.get('store'));
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
  }
});
