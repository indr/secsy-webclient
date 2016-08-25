import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    
    this.set('properties', this.getProperties());
  },
  
  getProperties() {
    const model = this.get('model');
    var shares = model.get('shares');
    if (!shares) {
      return;
    }
    
    shares = shares.sort((a, b) => {
      return a.get('createdAt') > b.get('createdAt');
    });
    this.set('shares', shares);
    const decoded = Ember.assign({}, ...shares.map((each) => each.decoded));
    
    var properties = model.getViewProperties();
    properties = properties.filter((each) => {
      if (each.key === 'emailAddress$') {
        return false;
      }
      if (decoded[each.key] === undefined) {
        return false;
      }
      each.update = decoded[each.key];
      each.checked = true;
      return true;
    });
    
    return properties;
  },
  
  actions: {
    update() {
      const selected = this.get('properties').filter((each) => {
        return each.checked;
      });
      
      if (selected.length === 0) {
        this.get('flashMessages').dangerT('review.error-no-selection');
        return;
      }
      
      this.sendAction('update', selected, this.get('shares'));
    },
    
    back() {
      this.sendAction('back');
    },
    
    dismiss() {
      this.sendAction('dismiss', this.get('shares'));
    }
  }
});
