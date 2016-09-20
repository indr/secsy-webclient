import attr from 'ember-data/attr';
import DS from 'ember-data';

// TODO: Readonly attributes?
export default DS.Model.extend({
  username: attr('string'),
  
  email: attr('string'),
  
  password: attr('string'),
  
  createdAt: attr('utc', {
    readonly: true
  }),
  
  gravatarUrl: attr('string', {
    readonly: true
  }),
  
  locale: attr('string'),
  
  syncEnabled: attr('boolean'),
  
  privateKey: attr('string', {
    readonly: true
  }),
  
  publicKey: attr('string', {
    readonly: true
  })
});
