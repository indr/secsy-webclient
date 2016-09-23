import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';
import utils from './utils';

const {
  RSVP
} = Ember;

export default Base.extend({
  data: {},
  
  init() {
    this._super(...arguments);
    
    const window = utils.window;
    if (!window) {
      Ember.debug('window is undefined');
      return;
    }
    
    try {
      this.data = JSON.parse(window.name) || {};
    } catch (error) {
      this.data = {};
    }
    window.name = null;
    
    if (window.addEventListener) {
      window.addEventListener('unload', this.flush.bind(this), false);
    } else if (window.attachEvent) {
      window.attachEvent('onunload', this.flush.bind(this));
    } else {
      Ember.debug('[session-store:voltaile] Unable to listen to window.unload or attach to window.onunload');
    }
  },
  
  persist(data) {
    try {
      this.data = Ember.copy(data, true);
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  restore() {
    try {
      return RSVP.resolve(Ember.copy(this.data, true));
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  clear() {
    try {
      this.data = {};
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  flush() {
    utils.window.name = JSON.stringify(this.data);
  }
})
