import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    
    this.set('properties', this.getProperties());
  },
  
  getProperties() {
    const propertyNames = ['name$'].concat(this.getPropertyNames());
    const model = this.get('model');
    
    return propertyNames.map((each) => {
      var [name, prefix] = each.replace('$', '').split('_').reverse();
      prefix = prefix || 'contact';
      var legend = prefix === 'contact' ? 'information' : prefix;
      return {
        key: each,
        legend: 'contact.legend.' + legend,
        value: model.get(each),
        name: [prefix, name].join('.'),
        checked: each !== 'name$' && each !== 'emailAddress$',
        disabled: each === 'emailAddress$'
      };
    });
  },
  
  getPropertyNames() {
    // TODO: Remove redundancy with sharer.js
    return [
      'contact_phoneNumber$', 'emailAddress$', 'contact_website$',
      'location_name$', 'location_latitude$', 'location_longitude$',
      'internet_skype$', 'internet_telegram$', 'internet_whatsapp$'
    ];
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
