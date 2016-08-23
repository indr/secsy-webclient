import Ember from 'ember';
import { viewProperties } from './../models/contact';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    
    this.set('properties', this.getProperties());
  },
  
  getProperties() {
    const model = this.get('model');
    const shares = model.get('shares').sort((a, b) => {
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
      this.sendAction('update', this.get('properties'));
    },
    
    back() {
      this.sendAction('back');
    },
    
    dismiss() {
      this.sendAction('dismiss');
    }
  }
});
