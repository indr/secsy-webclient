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
