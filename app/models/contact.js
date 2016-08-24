import attr from 'ember-data/attr';
import Ember from 'ember';
import Model from 'ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name$: validator('presence', true)
});

function buildViewProperties(model) {
  const propertyNames = ['name$',
    'contact_phoneNumber$', 'emailAddress$', 'contact_website$',
    'location_name$', 'location_latitude$', 'location_longitude$',
    'internet_skype$', 'internet_telegram$', 'internet_whatsapp$'
  ];
  
  return propertyNames.map((each) => {
    var [name, prefix] = each.replace('$', '').split('_').reverse();
    prefix = prefix || 'contact';
    var legend = prefix === 'contact' ? 'information' : prefix;
    return {
      key: each,
      legend: 'contact.legend.' + legend,
      value: model.get(each),
      name: [prefix, name].join('.')
      // checked: each !== 'name$' && each !== 'emailAddress$',
      // disabled: each === 'emailAddress$'
    };
  });
}

export default Model.extend(Validations, {
  createdAt: attr('date', {
    readonly: true
  }),
  updatedAt: attr('date', {
    readonly: true
  }),
  
  me: attr('boolean', {
    defaultValue: false,
    readonly: true
  }),
  
  decrypted: attr('boolean', {
    defaultValue: true,
    readonly: true
  }),
  
  name$: attr(),
  emailAddress$: attr(),
  contact_phoneNumber$: attr(),
  contact_website$: attr(),
  contact_notes$: attr(),
  location_name$: attr(),
  location_latitude$: attr(),
  location_longitude$: attr(),
  internet_skype$: attr(),
  internet_telegram$: attr(),
  internet_whatsapp$: attr(),
  
  
  location: Ember.computed('location_latitude$', 'location_longitude$', function () {
    if (!this.get('location_latitude$') || !this.get('location_longitude$')) {
      return null;
    }
    return [this.get('location_latitude$'), this.get('location_longitude$')];
  }),
  
  letter: Ember.computed('name$', function () {
    const result = this.get('name$');
    return result ? result.trimLeft().substr(0, 1).toUpperCase() : '-';
  }).readOnly(),
  
  ready: function () {
    this.maySetMeName();
  },
  
  maySetMeName() {
    if (Ember.isBlank(this.get('name$')) && this.get('me')) {
      const intl = Ember.getOwner(this).lookup('service:intl');
      this.set('name$', intl.t('contact.me-name'));
    }
  },
  
  getViewProperties() {
    return buildViewProperties(this);
  }
});
