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
    update() {
      const selected = this.get('properties').filter((each) => {
        return each.checked;
      });
      
      if (selected.length === 0) {
        this.get('flashMessages').dangerT('review.error-no-selection');
        return;
      }
      
      this.sendAction('update', selected);
    },
    
    back() {
      this.sendAction('back');
    },
    
    dismiss() {
      this.sendAction('dismiss');
    }
  }
});
