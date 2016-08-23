import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    
    this.set('properties', this.getProperties());
  },
  
  getProperties() {
    const model = this.get('model');
    const properties = model.getViewProperties();
    
    properties.forEach((each) => {
      var key = each.key;
      each.checked = key !== 'name$';
      each.disabled = key === 'emailAddress$'
    });
    
    return properties;
  },
  
  actions: {
    share() {
      const selected = this.get('properties').filter((each) => {
        return each.checked;
      });
      if (selected.length === 0) {
        this.get('flashMessages').dangerT('share.error-no-selection');
        return;
      }
      this.sendAction('share', selected);
    },
    
    cancel() {
      this.sendAction('cancel');
    }
  }
});
