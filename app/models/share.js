import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: attr('date'),
  for: attr('string'),
  encrypted: attr('string')
});
