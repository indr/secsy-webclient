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

function debug (message) {
  Ember.debug('[store:window] ' + message);
}

export default Base.extend({
  data: {},
  whitelist: null,
  
  init() {
    debug('init()');
    this._super(...arguments);
    
    const window = utils.window;
    if (!window) {
      debug('window is undefined');
      return;
    }
    
    const config = ENV['secure-store'];
    if (config && config.volatile) {
      this.whitelist = Ember.isArray(config.volatile) ?
        config.volatile : new Array(config.volatile);
    }
    
    try {
      let data = JSON.parse(window.name) || {};
      this.data = this.whitelist ? utils.pick(data, this.whitelist) : data;
    } catch (error) {
      this.data = {};
    }
    window.name = null;
    
    if (window.addEventListener) {
      window.addEventListener('unload', this.flush.bind(this), false);
    } else if (window.attachEvent) {
      window.attachEvent('onunload', this.flush.bind(this));
    } else {
      debug('Unable to listen to window.unload or attach to window.onunload');
    }
  },
  
  persist(data) {
    debug('persist()');
    
    try {
      this.data = this.whitelist ? utils.pick(data, this.whitelist) : data;
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  restore() {
    debug('restore()');
    
    try {
      return RSVP.resolve(Ember.copy(this.data));
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  clear() {
    debug('clear()');
    
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
