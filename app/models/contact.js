import attr from 'ember-data/attr';
import Ember from 'ember';
import Model from 'ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name$: validator('presence', true)
});

export default Model.extend(Validations, {
  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),
  accessedAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),
  userId: attr('string'),
  me: attr('boolean', {
    defaultValue: false
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
  })
});


