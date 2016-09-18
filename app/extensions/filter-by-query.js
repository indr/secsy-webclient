/*global Sifter*/
import Ember from 'ember';

// https://github.com/lazybensch/ember-cli-filter-by-query

// Bugs?
// options.sort is overwritten
// Sifter doesn't properly handle propertyKeys with $ at the end

export {
  computedFilterByQuery, filterByQuery
}

function filterByQuery (array, propertyKeys, query, options) {
  if (!query) {
    return Ember.A(array);
  }
  
  // options = Ember.typeOf(options) === 'undefined' ? {} : options;
  options = Ember.assign({sort: true}, options);
  
  propertyKeys = Ember.makeArray(propertyKeys);
  var input, sifter, result, sort;
  sort = options.sort;//'sort' in options ? options.sort : true;
  delete options['sort'];
  
  input = array.map(function (item) {
    var hash = {};
    propertyKeys.forEach(function (key) {
      hash[key.replace(/\$$/, '')] = Ember.get(item, key);
    });
    return hash;
  });
  
  options.fields = options.fields || propertyKeys.map(function (key) {
      return key.replace(/\$$/, '')
    });
  options.limit = options.limit || array.length;
  options.limit = array.length || array.get('length');
  if (sort) {
    options.sort = propertyKeys.map(function (key) {
      return {field: key.replace(/\$$/, ''), direction: 'asc'};
    });
  }
  
  sifter = new Sifter(input);
  if (!sort) {
    sifter.getSortFunction = function () {
      return null;
    };
  }
  
  result = sifter.search(query, options);
  
  return Ember.A(result.items.map(function (item) {
    return Ember.A(array).objectAt(item.id);
  }));
}

function computedFilterByQuery (dependentKey, propertyKeys, queryKey, options) {
  propertyKeys = Ember.makeArray(propertyKeys);
  
  return Ember.computed(queryKey, '' + dependentKey + '.@each.{' + propertyKeys.join(',') + '}', function () {
    
    var array = this.get(dependentKey);
    var query = this.get(queryKey) || '';
    
    return filterByQuery(array, propertyKeys, query, options);
    
  });
}


