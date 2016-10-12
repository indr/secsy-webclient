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

import ENV from 'secsy-webclient/config/environment';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[store:volatile] ' + message);
}

export default Base.extend({
  data: {},
  key: 'ember_simple_auth:volatile',
  whitelist: null,
  
  init() {
    debug('init()');
    this._super(...arguments);
    
    this.window = utils.window;
    
    const config = ENV['secure-store'];
    if (config && config.volatile) {
      this.whitelist = Ember.isArray(config.volatile) ?
        config.volatile : new Array(config.volatile);
    }
    
    try {
      this._restore();
    } catch (error) {
      debug(error.name + ': ' + error.message);
      this.data = {};
    }
    
    this.window.name = '';
    this.window.localStorage.removeItem(this.key);
    
    if (this.window.addEventListener) {
      this.window.addEventListener('unload', this.flush.bind(this), false);
    } else if (this.window.attachEvent) {
      this.window.attachEvent('onunload', this.flush.bind(this));
    } else {
      debug('Unable to listen to window.unload or attach to window.onunload');
    }
  },
  
  _restore() {
    let windowData = JSON.parse(this.window.localStorage.getItem(this.key));
    let storageData = JSON.parse(this.window.name);
    
    if (this.whitelist) {
      storageData = utils.pick(storageData, this.whitelist);
      windowData = utils.pick(windowData, this.whitelist);
    }
    
    const keys = [].concat(Object.keys(storageData), Object.keys(windowData));
    const result = {};
    keys.forEach((each) => {
      const share1 = windowData[each];
      const share2 = storageData[each];
      const merged = this.merge(share1, share2);
      
      if (merged !== undefined) {
        result[each] = merged;
      }
    });
    
    this.data = result;
  },
  
  persist(data) {
    debug('persist()');
    
    this.data = this.whitelist ? utils.pick(data, this.whitelist) : data;
    
    return RSVP.resolve();
  },
  
  restore() {
    debug('restore()');
    
    return RSVP.resolve(this.data);
  },
  
  clear() {
    debug('clear()');
    
    this.data = {};
    
    return RSVP.resolve();
  },
  
  flush() {
    debug('flush()');
    
    try {
      const storageData = {};
      const windowData = {};
      
      Object.keys(this.data).forEach((each) => {
        const shares = this.split(this.data[each]);
        windowData[each] = shares[0];
        storageData[each] = shares[1];
      });
      
      this.window.name = JSON.stringify(windowData);
      this.window.localStorage.setItem(this.key, JSON.stringify(storageData));
    } catch (error) {
      debug(error.name + ': ' + error.message);
    }
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
    ];
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
  }
})
