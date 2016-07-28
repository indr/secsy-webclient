// import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  // crypto: Ember.inject.service('crypto'),
  //
  // serialize(/*snapshot, options*/) {
  //   const crypto = this.get('crypto');
  //   const json = this._super(...arguments);
  //
  //   json.data.attributes = {
  //     base64: crypto.encrypt(json.data.attributes)
  //   };
  //
  //   return json;
  // },
  //
  // normalize(typeClass, hash) {
  //   const crypto = this.get('crypto');
  //   hash.attributes = crypto.decrypt(hash.attributes.base64);
  //
  //   return this._super(...arguments);
  // }
});
