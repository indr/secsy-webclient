import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  
  keyForAttribute: function (attr) {
    return Ember.String.underscore(attr);
  },
  
  /**
   *  Embeds the payload in a root object.
   */
  _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
    const modelName = primaryModelClass.modelName;
    const transformed = {};
    transformed[modelName] = payload;
    
    return this._super(store, primaryModelClass, transformed, id, requestType, isSingle);
  },
  
  /**
   * Extracts the root object of hash.
   */
  serializeIntoHash(hash, typeClass, snapshot, options) {
    const result = this._super(hash, typeClass, snapshot, options);
    
    if (Object.keys(hash).length > 1) {
      throw new Error('Can not serialize more than one object');
    }
    
    const rootKey = Object.keys(hash)[0];
    const root = hash[rootKey];
    var rootKeyOverwritten = false;
    Object.keys(root).forEach((eachKey) => {
      hash[eachKey] = root[eachKey];
      rootKeyOverwritten = rootKeyOverwritten || eachKey === rootKey;
    });
    if (!rootKeyOverwritten) {
      delete hash[rootKey];
    }
    
    return result;
  },
  
  serializeAttribute: function (record, json, key, attribute) {
    if (attribute.options && attribute.options.readonly) {
      // no-op
    } else {
      this._super(record, json, key, attribute);
    }
  }
});
