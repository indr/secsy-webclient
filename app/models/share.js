import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),
  
  for: attr('string'),
  algorithm: attr('string'),
  encrypted: attr('string')
});
