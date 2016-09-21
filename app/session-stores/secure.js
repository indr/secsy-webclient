import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';

import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import WindowStore from './window';

const {
  RSVP
} = Ember;

function debug (message) {
  Ember.debug('[store:secure] ' + message);
}

export default Base.extend({
  secured: null,
  
  init() {
    debug('init()');
    this._super(...arguments);
    
    this.set('_adaptiveStore', this._createStore(AdaptiveStore));
    this.set('_windowStore', this._createStore(WindowStore));
  },
  
  persist(data) {
    debug('persist()');
    
    const windowData = {};
    
    const secured = this.get('secured');
    if (Array.isArray(secured)) {
      secured.forEach((each) => {
        if (data.hasOwnProperty(each)) {
          windowData[each] = data[each];
          delete data[each];
        }
      });
    }
    
    return RSVP.all([
      this.get('_adaptiveStore').persist(data),
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
      return Ember.assign({}, ...datas);
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
  
  _createStore(storeType, options) {
    const store = storeType.create(options);
    
    store.on('sessionDataUpdated', (data) => {
      debug('event on sessionDataUpdated');
      this.trigger('sessionDataUpdated', data);
    });
    return store;
  }
})
