import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api',

  pathForType: function(modelName) {
    var decamelized = Ember.String.decamelize(modelName);
    // return Ember.String.pluralize(decamelized);
    return decamelized;
  },

  handleResponse(status, headers, payload, requestData) {
    // console.log('adapters.contact:handleResponse', arguments);

    if (Ember.isArray(payload)) {
      payload = {
        'contacts': payload
      };
    } else if (payload['id']) {
      payload = {
        'contact': payload
      };
    }

    return this._super(status, headers, payload, requestData);
  }
});
