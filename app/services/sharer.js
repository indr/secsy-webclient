import Ember from 'ember';

const {
  K,
  RSVP
} = Ember;

export default Ember.Service.extend({
  addressbook: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  keystore: Ember.inject.service(),
  crypto: Ember.inject.service(),
  openpgp: Ember.inject.service(),
  
  /**
   *
   * @param properties
   * @param progress
   * @returns {Promise.<TResult>}
   */
  share(properties, progress) {
    const self = this;
    progress = progress || K;
    
    var data = this.prepareSharedData(properties);
    if (Ember.isEmpty(data)) {
      return RSVP.resolve();
    }
    
    var status = {
      max: 0,
      value: 0
    };
    
    return this.get('crypto').encodeBase64(data).then((encoded) => {
      data = {base64: encoded};
    }).then(()=> {
      // return this.get('store').findAll('contact');
      return this.get('addressbook').findContacts();
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
        
        status.value++;
        const emailAddress = contact.get('emailAddress$');
        if (Ember.isBlank(emailAddress)) {
          progress(status);
          return RSVP.resolve(contacts);
        }
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
            return self.get('store').createRecord('update', {
              emailSha256: options.emailSha256,
              encrypted_: options.encrypted
            }).save();
          }).then(() => {
            progress(status);
            return contacts;
          });
      }, contacts);
    });
  },
  
  prepareSharedData(selected) {
    return selected.reduce(function (result, each) {
      result[each.key] = each.value;
      return result;
    }, {});
  }
});
