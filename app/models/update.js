import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: attr('utc', {
    readonly: true
  }),
  
  fromEmailSha256: attr('string', {
    readonly: true
  }),
  
  toEmailSha256: attr('string'),
  
  encrypted_: attr('string')
});
