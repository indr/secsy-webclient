import Ember from 'ember';

const {
  K,
  RSVP
} = Ember;

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  crypto: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  /**
   *
   * @param me
   * @param progress
   * @returns {Promise.<TResult>}
   */
  share(me, progress) {
    const self = this;
    progress = progress || K;
    
    var data = {
      emailAddress$: me.get('emailAddress$'),
      phoneNumber$: me.get('phoneNumber$'),
      latitude$: me.get('latitude$'),
      longitude$: me.get('longitude$')
    };
    var status = {
      max: 0,
      value: 0
    };
    
    return this.get('crypto').encodeBase64(data).then((encoded) => {
      data = {base64: encoded};
    }).then(()=> {
      return this.get('store').findAll('contact');
    }).then((contacts) => {
      const results = contacts.toArray();
      status.max = results.length;
      progress(status);
      return results;
    }).then((contacts) => {
      return RSVP.promiseFor(null, function condition(contacts) {
        return contacts.length > 0;
      }, function action(contacts) {
        var contact = contacts.pop();
        
        return self.get('keystore').getPublicKey(contact.get('emailAddress$'))
          .then((key) => {
            if (!key) {
              return;
            }
            var armored = key.get('publicKey');
            var publicKey = self.get('openpgp').key.readArmored(armored).keys[0];
            return {
              emailSha256: key.get('emailSha256'),
              publicKey: publicKey
            };
          }).then((options) => {
            if (!options) {
              return;
            }
            return self.get('crypto').encrypt(data, options.publicKey).then((encrypted) => {
              options.encrypted = encrypted;
              return options;
            });
          }).then((options)=> {
            if (!options) {
              return;
            }
            return self.get('store').createRecord('share', {
              emailSha256: options.emailSha256,
              encrypted_: options.encrypted
            }).save();
          }).then(() => {
            status.value++;
            progress(status);
            return contacts;
          });
      }, contacts);
    });
  },
  
  getShares(progress) {
    const self = this;
    progress = progress || K;
    
    const emailAddress = self.get('session').get('data.authenticated.email');
    const emailHash = self.get('openpgp').sha256(emailAddress);
    
    var status = {
      max: 0,
      value: 0
    };
    
    return this.get('store').query('share', {emailSha256: emailHash}).then((shares) => {
      const result = shares.toArray();
      status.max = result.length;
      progress(status);
      return result;
    }).then(function (shares) {
      return RSVP.promiseFor([], function condition(shares) {
        return shares.length > 0;
      }, function action(shares, aggregate) {
        var share = shares.pop();
        
        return self.get('crypto').decrypt(share.get('encrypted_')).then((decrypted) => {
          return self.get('crypto').decodeBase64(decrypted.base64);
        }).then((decoded) => {
          if (Object.keys(decoded).length === 0) {
            console.log('Decoded object is empty, destroying record');
            return share.destroyRecord();
          }
          share.set('decoded', decoded);
          aggregate.push(share);
        }).catch((err) => {
          console.log('Decoding failed with ' + (err.message || err));
          console.log('Destroying record');
          return share.destroyRecord();
        }).then(() => {
          status.value++;
          progress(status);
          return shares;
        });
      }, shares);
    }).then((result)=> {
      console.log('Loaded %s shares', result.length);
      return result;
    });
  },
  
  digestShares(shares, progress) {
    progress = progress || K;
    
    return this.get('store').findAll('contact').then((contacts) => {
      return contacts;//contacts.toArray();
    }).then((contacts) => {
      shares.forEach((share) => {
        const decoded = share.get('decoded');
        const contact = contacts.findBy('emailAddress$', decoded.emailAddress$);
        
        if (!contact) {
          console.log('Contact not found ' + decoded.emailAddress$);
        }
        else {
          var shares = contact.get('shares');
          if (!shares) {
            shares = [];
            contact.set('shares', shares);
          }
          
          var found = false;
          for (var i = 0; i < shares.length; i++) {
            if (shares[i].id === share.id) {
              found = true;
              break;
            }
          }
          if (!found) {
            shares.push(share);
            contact.set('shares', null);
            contact.set('shares', shares);
            
            var count = contact.get('sharesCount') || 0;
            contact.set('sharesCount', count + 1);
          }
        }
      });
    });
  }
});
