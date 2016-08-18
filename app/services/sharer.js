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

export default Ember.Service.extend({
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  crypto: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  share(me) {
    // See http://stackoverflow.com/questions/24660096/correct-way-to-write-loops-for-promise
    const promiseFor = RSVP.Promise.method(function (condition, action, value) {
      if (!condition(value)) {
        return;
      }
      return action(value).then(promiseFor.bind(null, condition, action));
    });
    
    const self = this;
    
    return this.get('store').findAll('contact').then((contacts) => {
      return contacts.toArray();
    }).then((contacts) => {
      return promiseFor(function condition(contacts) {
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
            return self.get('crypto').encrypt(me, options.publicKey).then((encrypted) => {
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
  }
});
