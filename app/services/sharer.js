import Ember from 'ember';

const {RSVP} = Ember;

/**
 * Returns a new function that wraps the given function fn. The new function will always return a promise that is
 * fulfilled with the original functions return values or rejected with thrown exceptions from the original function.
 *
 * This method is convenient when a function can sometimes return synchronously or throw synchronously.
 *
 * See http://bluebirdjs.com/docs/api/promise.method.html
 *
 * @param fn
 * @returns {Function}
 */
RSVP.Promise.method = function (fn) {
  return function () {
    return new RSVP.Promise((resolve, reject) => {
      try {
        resolve(fn(...arguments));
      }
      catch (err) {
        reject(err);
      }
    });
  };
};

// See http://stackoverflow.com/questions/24660096/correct-way-to-write-loops-for-promise
const promiseFor = RSVP.Promise.method(function (aggregate, condition, action, value) {
  if (!condition(value)) {
    return aggregate;
  }
  return action(value, aggregate).then(promiseFor.bind(null, aggregate, condition, action));
});

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  crypto: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  share(me) {
    const self = this;
    var data = {
      emailAddress$: me.get('emailAddress$'),
      phoneNumber$: me.get('phoneNumber$'),
      latitude$: me.get('latitude$'),
      longitude$: me.get('longitude$')
    };
    return this.get('crypto').encodeBase64(data).then((encoded) => {
      data = {base64: encoded};
    }).then(()=> {
      return this.get('store').findAll('contact');
    }).then((contacts) => {
      return contacts.toArray();
    }).then((contacts) => {
      return promiseFor(null, function condition(contacts) {
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
            return contacts;
          });
      }, contacts);
    });
  },
  
  getShares() {
    const self = this;
    const emailAddress = self.get('session').get('data.authenticated.email');
    const emailHash = self.get('openpgp').sha256(emailAddress);
    
    return this.get('store').query('share', {emailSha256: emailHash}).then((shares) => {
      return shares.toArray();
    }).then(function (shares) {
      return promiseFor([], function condition(shares) {
        return shares.length > 0;
      }, function action(shares, aggregate) {
        var share = shares.pop();
        
        return self.get('crypto').decodeBase64(share.get('base64')).then((decoded) => {
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
          return shares;
        });
      }, shares);
    }).then((result)=> {
      console.log('Loaded %s shares', result.length);
      return result;
    });
  },
  
  digestShares(shares) {
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
