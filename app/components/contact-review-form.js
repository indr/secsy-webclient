import Ember from 'ember';

export default Ember.Component.extend({
  // TODO: If `model.mergedUpdate` changes when the user is selecting properties to update,
  // he will lose his selection because this makes all properties `checked=true` again.
  properties: Ember.computed('model.mergedUpdate', function () {
    const contact = this.get('model');
    const update = contact.get('mergedUpdate');
    
    return contact.getViewProperties().filter((each) => {
      if (update[each.key] === undefined) {
        return false;
      }
      each.update = update[each.key];
      each.checked = true;
      return true;
    });
  }).readOnly(),
  
  actions: {
    apply() {
      const keys = this.get('properties').reduce(function (result, each) {
        if (each.checked) {
          result.push(each.key);
        }
        return result;
      }, []);
      
      if (keys.length === 0) {
        this.get('flashMessages').dangerT('review.error-no-selection');
        return;
      }
      
      this.sendAction('apply', keys);
    },
    
    back() {
      this.sendAction('back');
    },
    
    dismiss() {
      this.sendAction('dismiss');
    }
  }
});
