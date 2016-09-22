// https://github.com/ProtonMail/WebClient/blob/public/src/app/libraries/pmcrypto.js
// https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js

import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';
import utils from './utils';

import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import WindowStore from './window';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[store:secure] ' + message);
}

export default Base.extend({
  keyNames: ['authenticated'],
  
  init() {
    debug('init()');
    this._super(...arguments);
    
    this.set('_adaptiveStore', this._createStore(AdaptiveStore));
    this.set('_windowStore', this._createStore(WindowStore));
  },
  
  persist(data) {
    debug('persist()');
    
    const windowData = {};
    const adaptiveData = Ember.copy(data, true);
    
    const keyNames = this.get('keyNames');
    if (Array.isArray(keyNames)) {
      keyNames.forEach((keyName) => {
        if (utils.has(data, keyName)) {
          const value = utils.get(data, keyName);
          
          const shares = this.split(value);
          utils.set(adaptiveData, keyName, shares[1]);
          windowData[keyName] = shares[0]
        }
      });
    }
    
    return RSVP.all([
      this.get('_adaptiveStore').persist(adaptiveData),
      this.get('_windowStore').persist(windowData)
    ]).then(() => {
      // Don't return promise array
    });
  },
  
  restore() {
    debug('restore()');
    
    return RSVP.all([
      this.get('_adaptiveStore').restore(),
      this.get('_windowStore').restore(),
    ]).then((datas) => {
      const adaptiveData = datas[0];
      const windowData = datas[1];
      
      const result = adaptiveData;
      const keyNames = this.get('keyNames');
      if (Array.isArray(keyNames)) {
        keyNames.forEach((keyName) => {
          const share1 = windowData[keyName];
          const share2 = utils.get(adaptiveData, keyName);
          
          const merged = this.merge(share1, share2);
          if (merged === undefined) {
            utils.del(result, keyName);
          } else {
            utils.set(result, keyName, merged);
          }
        });
      }
      return result;
    });
  },
  
  clear() {
    debug('clear()');
    
    return RSVP.all([
      this.get('_adaptiveStore').clear(),
      this.get('_windowStore').clear()
    ]).then(() => {
      // Don't return promise array
    });
  },
  
  split(value) {
    value = JSON.stringify(value);
    const item = utils.binaryStringToArray(value);
    const paddedLength = Math.ceil(item.length / 256) * 256;
    
    let share1 = utils.getRandomValues(new Uint8Array(paddedLength));
    let share2 = new Uint8Array(share1);
    
    for (var i = 0; i < item.length; i++) {
      share2[i] ^= item[i];
    }
    
    return [
      utils.encode_base64(utils.arrayToBinaryString(share1)),
      utils.encode_base64(utils.arrayToBinaryString(share2))
    ]
  },
  
  merge(share1, share2) {
    if (share1 === undefined || share2 === undefined) {
      return;
    }
    share1 = utils.binaryStringToArray(utils.decode_base64(share1));
    share2 = utils.binaryStringToArray(utils.decode_base64(share2));
    
    if (share1.length !== share2.length) {
      return;
    }
    
    let xored = new Array(share1.length);
    
    for (var i = 0; i < share1.length; i++) {
      xored[i] = share1[i] ^ share2[i];
    }
    
    // Strip off padding
    let unpaddedLength = share1.length;
    
    while (unpaddedLength > 0 && xored[unpaddedLength - 1] === 0) {
      unpaddedLength--;
    }
    
    const result = utils.arrayToBinaryString(xored.slice(0, unpaddedLength));
    return JSON.parse(result);
  },
  
  _createStore(storeType, options) {
    const store = storeType.create(options);
    
    store.on('sessionDataUpdated', (data) => {
      debug('event on sessionDataUpdated');
      this.trigger('sessionDataUpdated', data);
    });
    return store;
  }
})
