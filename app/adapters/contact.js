//
// Version: ajax() overwrite
//
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
    
    var result;
    if (!options || !options.data || Object.keys(options.data).length === 0) {
      result = this._super(...arguments);
    }
    else {
      result = this.encryptOne(url, type, options)
        .then(() => _super.call(self, ...arguments));
    }
    return result
      .then((response) => {
        return self.decrypt(response);
      });
  },
  
  decrypt(response) {
    const data = response['contacts'] || response['contact'] || null;
    
    if (!data) {
      return response;
    }
    
    if (_.isArray(data)) {
      this.decryptMany(data);
    }
    else {
      this.decryptOne(data);
    }
    
    return response;
  },
  
  decryptMany(results) {
    const self = this;
    _.forEach(results, (each) => self.decryptOne(each));
    return results;
  },
  
  decryptOne(result) {
    const data = result;
    for (var key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      
      if (key.indexOf('_') === -1) {
        continue;
      }
      
      const encrypted = data[key];
      const plain = this.get('crypto').decrypt(encrypted);
      Ember.assign(data, plain);
      delete data[key];
    }
    
    return result;
  },
  
  encryptOne(url, type, options) {
    return new RSVP.Promise((resolve) => {
      const data = options.data['contact'];
      const plain = {};
      for (var key in data) {
        if (!data.hasOwnProperty(key)) {
          continue;
        }
        
        if (key.indexOf('$') === -1) {
          continue;
        }
        
        plain[key] = data[key];
        delete data[key];
      }
      
      data['encrypted_'] = this.get('crypto').encrypt(plain);
      
      resolve(url, type, options);
    });
  }
});

//
// Version: ApplicationAdapter as this.inner
//
// import Ember from 'ember';
// import Adapter from "ember-data/adapter";
//
// const {
//   RSVP
// } = Ember;
//
// export default Adapter.extend({
//   inner: null,
//
//   init() {
//     this._super(...arguments);
//     const applicationInstance = Ember.getOwner(this);
//     this.inner = applicationInstance.lookup('adapter:application');
//   },
//
//   createRecord() {
//     return this.inner.createRecord(...arguments);
//   },
//
//   deleteRecord() {
//     return this.inner.deleteRecord(...arguments);
//   },
//
//   findAll() {
//     return this.inner.findAll(...arguments)
//       .then(this.decryptMany);
//   },
//
//   findMany() {
//     return this.inner.findMany(...arguments)
//       .then(this.decryptMany);
//   },
//
//   findRecord() {
//     return this.inner.findRecord(...arguments)
//       .then(this.decryptOne);
//   },
//
//   updateRecord(store, type, snapshot) {
//     return this.encryptOne(store, type, snapshot)
//       .then(() => {
//         return this.inner.updateRecord(...arguments);
//       });
//   },
//
//   decryptMany(results) {
//     console.log('decryptMany', results);
//     return results;
//   },
//
//   decryptOne(result) {
//     console.log('decryptOne', result);
//     return result;
//   },
//
//   encryptOne(store, type, snapshot) {
//     console.log('encryptOne', snapshot);
//     return new RSVP.Promise((resolve, reject) => {
//       resolve(store, type, snapshot);
//     })
//   }
// });
