import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: attr('date', {
    readonly: true
  }),
  emailSha256: attr('string'),
  encrypted_: attr('string')
});
