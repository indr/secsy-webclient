import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';

function debug (message, args) {
  Ember.debug('[store:secure] ' + message);
  console.log('arguments:', ...args);
}

export default Base.extend({
  
  init() {
    debug('init()', arguments);
    this._super(...arguments);
    
    const store = AdaptiveStore.create();
    this.set('_store', store);
  },
  
  _createStore(storeType, options) {
    const store = storeType.create(options);
    
    store.on('sessionDataUpdated', (data) => {
      this.trigger('sessionDataUpdated', data);
    });
    return store;
  },
  
  persist() {
    debug('persist()', arguments);
    return this.get('_store').persist(...arguments);
  },
  
  restore() {
    debug('restore()', arguments);
    return this.get('_store').restore(...arguments);
  },
  
  clear() {
    debug('clear()', arguments);
    return this.get('_store').clear(...arguments);
  }
})
