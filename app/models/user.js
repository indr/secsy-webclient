import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  username: attr('string', {
    readonly: true
  }),
  
  email: attr('string', {
    readonly: true
  }),
  
  password: attr('string', {
    readonly: true,
  }),
  
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
