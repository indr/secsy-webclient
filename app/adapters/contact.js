import _ from 'lodash';
import ApplicationAdapter from './application';
import Ember from 'ember';

const {
  RSVP
} = Ember;

export default ApplicationAdapter.extend({
  crypto: Ember.inject.service(),
  
  ajax(url, type, options) {
    const self = this;
    const _super = this._super;
    
    return self.deepEncrypt(options ? options.data : null)
      .then(() => {
        return _super.call(self, url, type, options);
      })
      .then((response) => {
        return self.deepDecrypt(response);
      });
  },
  
  deepEncrypt(obj) {
    const self = this;
    return new RSVP.Promise((resolve) => {
      const promises = [];
      
      if (_.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          promises.push(self.deepEncrypt(obj[i]));
        }
      }
      else {
        const plain = {};
        
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          
          if (key.indexOf('$') === key.length - 1) {
            plain[key] = obj[key];
            delete obj[key];
            continue;
          }
          
          if (_.isObject(obj[key])) {
            promises.push(self.deepEncrypt(obj[key]));
          }
        }
        
        if (Object.keys(plain).length > 0) {
          const crypto = self.get('crypto');
          promises.push(crypto.encrypt(plain)
            .then((encrypted) => {
              obj['encrypted_'] = encrypted;
            }));
        }
      }
     
      RSVP.allSettled(promises)
        .then(() => {
          resolve(obj);
        });
    });
  },
  
  deepDecrypt(obj) {
    const self = this;
    return new RSVP.Promise((resolve) => {
      const promises = [];
      
      if (_.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          promises.push(self.deepDecrypt(obj[i]));
        }
      }
      else {
        var encrypted = null;
        
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          
          if (key === 'encrypted_') {
            encrypted = obj[key];
            delete obj[key];
            continue;
          }
          
          if (_.isObject(obj[key])) {
            promises.push(self.deepDecrypt(obj[key]));
          }
        }
        
        if (encrypted !== null) {
          const crypto = this.get('crypto');
          promises.push(crypto.decrypt(encrypted)
            .then((plain) => {
              Ember.assign(obj, plain);
            }));
        }
      }
      
      RSVP.allSettled(promises)
        .then(() => {
          resolve(obj);
        });
    });
  }
});
