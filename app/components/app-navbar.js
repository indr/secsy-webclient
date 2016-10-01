/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  session: Ember.inject.service(),
  keychain: Ember.inject.service(),
  
  canSearch: false,
  isSearchVisible: false,
  
  isSearchItemVisible: Ember.computed('canSearch', 'isSearchVisible', function () {
    return this.get('canSearch') && !this.get('isSearchVisible');
  }),
  
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    openSearch() {
      this.sendAction('openSearch');
    }
  },
  
  keyboardShortcuts: {
    'ctrl+f': 'openSearch',
    '/': 'openSearch'
  }
});
