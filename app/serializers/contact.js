import Ember from 'ember';
import RESTSerializer from 'ember-data/serializers/rest';
import ApplicationSerializer from './application';

export default window.Addressbook.seneca ? seneca() : mirage();

function seneca() {
  return RESTSerializer.extend({
    // serialize(/*snapshot, options*/) {
    //   // console.log('serializers.contact:serialize', arguments);
    //   return this._super(...arguments);
    // },

    serializeIntoHash: function (data, type, record, options) {
      // console.log('serializer.contact:serializeIntoHash', arguments);
      // var root = Ember.String.decamelize(type.modelName);
      // data[root] = this.serialize(record, options);
      Ember.merge(data, this.serialize(record, options));
    }

    // normalize(/*typeClass, hash*/) {
    //   // console.log('serializer.contact:normalize', arguments);
    //   return this._super(...arguments);
    // }
  });
}

function mirage() {
  return ApplicationSerializer.extend({
    crypto: Ember.inject.service('crypto'),

    serialize(/*snapshot, options*/) {
      const crypto = this.get('crypto');
      const json = this._super(...arguments);

      json.data.attributes = {
        base64: crypto.encrypt(json.data.attributes)
      };

      return json;
    },

    normalize(typeClass, hash) {
      const crypto = this.get('crypto');
      hash.attributes = crypto.decrypt(hash.attributes.base64);

      return this._super(...arguments);
    }
  });
}
