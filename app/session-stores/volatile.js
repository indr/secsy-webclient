/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';
import utils from './utils';

import ENV from 'secsy-webclient/config/environment';

const {
  RSVP
} = Ember;

export default Base.extend({
  data: {},
  whitelist: null,
  
  init() {
    this._super(...arguments);
    
    const window = utils.window;
    if (!window) {
      Ember.debug('window is undefined');
      return;
    }
    
    if (ENV['volatile-store'] && ENV['volatile-store'].whitelist) {
      const whitelist = ENV['volatile-store'].whitelist;
      this.whitelist = Ember.isArray(whitelist) ? whitelist : new Array(whitelist);
    }
    
    try {
      let data = JSON.parse(window.name) || {};
      this.data = this._onlyWhitelisted(data);
      
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
      this.data = this._onlyWhitelisted(data);
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  restore() {
    try {
      return RSVP.resolve(Ember.copy(this.data));
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
  },
  
  _onlyWhitelisted(data) {
    if (this.whitelist) {
      let result = {};
      this.whitelist.forEach((keyName) => {
        utils.set(result, keyName, utils.get(data, keyName));
      });
      return result;
    } else {
      return Ember.copy(data);
    }
  }
})
