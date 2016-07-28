//import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api'

  //pathForType: function (modelName) {
  //  return Ember.String.decamelize(modelName);
  //}
});
