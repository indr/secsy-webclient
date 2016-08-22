import Ember from 'ember';

const {
  $,
  A,
  computed
} = Ember;

export default Ember.Component.extend({
  sorting: ['letter:desc'],
  sorted: Ember.computed.sort('model', 'sorting'),
  groups: groupBy('sorted', 'letter'),
  
  didInsertElement() {
    this._super(...arguments);
    
    $('html,body').scrollspy({
      offset: 70,
      target: '#letters-scrollspy',
    });
    this.$('#letters-affix').affix({
      offset: {
        top: 75
      }
    });
  }
});


/**
 * Groups an already sorted dependentKey by the specified propertyKey.
 *
 * TODO: I guess a for loop is faster than a .forEach() call?
 *
 * https://github.com/HeroicEric/ember-group-by
 *
 * @param dependentKey
 * @param propertyKey
 * @returns {Ember.ComputedProperty}
 */
function groupBy(dependentKey, propertyKey) {
  
  return computed('' + dependentKey + '.@each.{' + propertyKey + '}', function () {
    var groups = new A();
    var items = this.get(dependentKey);
    
    var group = null;
    for (var i = items.get('length') - 1; i >= 0; i--) {
      var item = items.objectAt(i);
      var value = item.get(propertyKey);
      
      if (!group || group.value !== value) {
        group = {value};
        group.items = Ember.A();
        groups.pushObject(group);
      }
      group.items.pushObject(item);
    }
    return groups;
  });
}
