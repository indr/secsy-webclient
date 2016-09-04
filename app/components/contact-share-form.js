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
      each.checked = !Ember.isBlank(each.value) && key !== 'name$';
      each.disabled = key === 'emailAddress$';
    });
    
    return properties;
  },
  
  actions: {
    share() {
      const data = this.get('properties').reduce((result, each) => {
        if (each.checked && each.key !== 'emailAddress$') {
          result[each.key] = each.value;
        }
        return result;
      }, {});
      
      if (Object.keys(data).length === 0) {
        this.get('flashMessages').dangerT('share.error-no-selection');
        return;
      }
      this.sendAction('share', data);
    },
    
    cancel() {
      this.sendAction('cancel');
    }
  }
});
