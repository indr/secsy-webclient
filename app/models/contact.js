import attr from 'ember-data/attr';
import Ember from 'ember';
import Model from 'ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name$: validator('presence', true)
});

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
  phoneNumber$: attr(),
  latitude$: attr(),
  longitude$: attr(),
  
  location: Ember.computed('latitude$', 'longitude$', function () {
    if (!this.get('latitude$') || !this.get('longitude$')) {
      return null;
    }
    return [this.get('latitude$'), this.get('longitude$')];
  }),
  
  letter: Ember.computed('name$', function () {
    return this.get('name$').trimLeft().substr(0, 1).toUpperCase() || '-';
  }).readOnly(),

  ready: function () {
    this.maySetMeName();
  },
  
  maySetMeName() {
    if (Ember.isBlank(this.get('name$')) && this.get('me')) {
      const intl = Ember.getOwner(this).lookup('service:intl');
      this.set('name$', intl.t('contact.me-name'));
    }
  }
});
