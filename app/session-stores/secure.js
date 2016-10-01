/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

// https://github.com/ProtonMail/WebClient/blob/public/src/app/libraries/pmcrypto.js
// https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js

import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';
import utils from './utils';

import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import VolatileStore from './volatile';

import ENV from 'addressbook/config/environment';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[store:secure] ' + message);
}

export default Base.extend({
  securelist: null,
  volatilelist: null,
  
  init() {
    debug('init()');
    this._super(...arguments);
    
    if (ENV['secure-store'] && ENV['secure-store'].whitelist) {
      let whitelist = ENV['secure-store'].whitelist;
      whitelist = Ember.isArray(whitelist) ? whitelist : new Array(whitelist);
      this.securelist = whitelist;
    }
    
    if (ENV['volatile-store'] && ENV['volatile-store'].whitelist) {
      let volatilelist = ENV['volatile-store'].whitelist;
      volatilelist = Ember.isArray(volatilelist) ? volatilelist : new Array(volatilelist);
      if (this.securelist) {
        volatilelist.forEach((each) => {
          this.securelist.push(each);
        });
      }
      this.volatilelist = volatilelist;
    }
    
    if (this.securelist && this.securelist.indexOf('authenticated') === -1) {
      this.securelist.push('authenticated');
    }
    this.set('_adaptiveStore', this._createStore(AdaptiveStore));
    this.set('_volatileStore', this._createStore(VolatileStore));
  },
  
  persist(data) {
    debug('persist()');
    
    let volatileData = {};
    let adaptiveData = {};
    
    const securelist = this.get('securelist');
    if (!Array.isArray(securelist)) {
      adaptiveData = Ember.copy(data, true);
    } else {
      securelist.forEach((keyName) => {
        if (utils.has(data, keyName)) {
          const value = utils.get(data, keyName);
          utils.set(adaptiveData, keyName, value);
        }
      });
    }
    
    const volatilelist = this.get('volatilelist');
    if (Array.isArray(volatilelist)) {
      volatilelist.forEach((keyName) => {
        if (utils.has(adaptiveData, keyName)) {
          const value = utils.get(adaptiveData, keyName);
          const shares = this.split(value);
          utils.set(adaptiveData, keyName, shares[1]);
          utils.set(volatileData, keyName, shares[0]);
        }
      });
    }
    
    return RSVP.all([
      this.get('_adaptiveStore').persist(adaptiveData),
      this.get('_volatileStore').persist(volatileData)
    ]).then(() => {
      // Don't return promise array
    });
  },
  
  restore() {
    debug('restore()');
    
    return RSVP.all([
      this.get('_adaptiveStore').restore(),
      this.get('_volatileStore').restore(),
    ]).then((datas) => {
      const adaptiveData = datas[0];
      const volatileData = datas[1];
      
      const result = adaptiveData;
      const volatilelist = this.get('volatilelist');
      if (Array.isArray(volatilelist)) {
        volatilelist.forEach((keyName) => {
          const share1 = utils.get(volatileData, keyName);
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
      this.get('_volatileStore').clear()
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
