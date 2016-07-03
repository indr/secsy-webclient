import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(snapshot/*, options*/) {
    const json = this._super(...arguments);

    json.data.attributes = {
      encoded: window.btoa(JSON.stringify(json.data.attributes))
    };

    return json;
  },

  normalize(typeClass, hash) {
    hash.attributes = JSON.parse(window.atob(hash.attributes.encoded));

    return this._super(...arguments);
  }
});
