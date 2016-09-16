import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  username: attr('string'),
  email: attr('string'),
  password: attr('string'),
  createdAt: attr('utc'),
  gravatarUrl: attr('string'),
  locale: attr('string'),
  privateKey: attr('string'),
  publicKey: attr('string')
});
