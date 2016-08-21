import Ember from 'ember';

const {
  A,
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  sorting: ['letter:desc'],
  sorted: Ember.computed.sort('model', 'sorting').readOnly(),
  groups: groupBy('sorted', 'letter')
});


/**
 * Groups an already sorted collection by the specified property.
 *
 * TODO: I guess a for loop is faster than a .forEach() call?
 *
 * https://github.com/HeroicEric/ember-group-by
 *
 * @param collection
 * @param property
 * @returns {Ember.ComputedProperty}
 */
function groupBy(collection, property) {
  var dependentKey = collection + '.@each.' + property;
  
  return computed(dependentKey, function () {
    var groups = new A();
    var items = get(this, collection);
    
    var group = null;
    for (var i = items.get('length') - 1; i >= 0; i--) {
      var item = items.objectAt(i);
      var value = get(item, property);
      
      if (!group || group.value !== value) {
        group = {
          value, items: [item]
        };
        groups.push(group);
      } else {
        group.items.push(item);
      }
    }
    return groups;
  }).readOnly();
}
