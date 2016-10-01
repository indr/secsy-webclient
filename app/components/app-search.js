/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[component:app-search] ' + message);
// }

export default Ember.Component.extend({
  addressbook: Ember.inject.service(),
  
  keyUp(evnt) {
    if (evnt.keyCode === 27) {
      this.set('addressbook.searchQuery', null);
      this.sendAction('close');
    }
  },
  
  actions: {
    close() {
      this.set('addressbook.searchQuery', null);
      this.sendAction('close');
    }
  }
});
