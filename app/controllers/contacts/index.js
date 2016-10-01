/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { computedFilterByQuery } from './../../extensions/filter-by-query';
import Ember from 'ember';

export default Ember.Controller.extend({
  addressbook: Ember.inject.service(),
  
  showCreateOrGenerateHints: false,
  
  searchQuery: Ember.computed('addressbook.searchQuery', function () {
    return this.get('addressbook.searchQuery');
  }),
  
  filteredModel: computedFilterByQuery('model', ['name$', 'emailAddress$'], 'searchQuery', {sort: false}),
});
