import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';
import Utils from './utils';

import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import WindowStore from './window';

const {RSVP} = Ember;
const {del, get, has, set} = Utils;

function debug (message) {
  Ember.debug('[store:secure] ' + message);
}

export default Base.extend({
  keyNames: null,
  
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
        if (has(data, keyName)) {
          const value = get(data, keyName);
          
          const shares = this.split(value);
          set(adaptiveData, keyName, shares[1]);
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
          const share2 = get(adaptiveData, keyName);
          
          const merged = this.merge(share1, share2);
          if (merged === undefined) {
            del(result, keyName);
          } else {
            set(result, keyName, merged);
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
    const idx = Math.ceil(value.length / 2);
    
    return [value.substr(0, idx), value.substr(idx)];
  },
  
  merge() {
    if (arguments[0] === undefined || arguments[1] === undefined) {
      return undefined;
    }
    const value = arguments[0] + arguments[1];
    return JSON.parse(value);
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
