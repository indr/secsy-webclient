import DS from 'ember-data';
import Ember from 'ember';
import { errorsArrayToHash } from "ember-data/adapters/errors";

const get = Ember.get;

export default Ember.Mixin.create({
  
  // See https://github.com/emberjs/data/blob/v2.7.0/addon/-private/system/model/internal-model.js#L720
  // var adapterDidInvalidate = InternalModel.prototype.adapterDidInvalidate;
  // var addErrorMessageToAttribute = InternalModel.prototype.addErrorMessageToAttribute;
  
  init: function () {
    this._super(...arguments);
    
    if (this.get('errors') === undefined) {
      this.set('errors', DS.Errors.create());
    }
  },
  
  handleValidationErrors: function (err, options) {
    // console.log('#handleValidationErrors', err);
    
    var hash = errorsArrayToHash(err.errors);
    this._adapterDidInvalidate(hash, options);
  },
  
  _errorsArrayToHash: errorsArrayToHash,
  
  _adapterDidInvalidate: function (errors, options) {
    // console.log('#_adapterDidInvalidate', errors);
    
    var attribute;
    
    for (attribute in errors) {
      if (errors.hasOwnProperty(attribute)) {
        this._addErrorMessageToAttribute(options[attribute] || attribute, errors[attribute]);
      }
    }
    
    // Trigger validation of ds-error
    this.validate();
  },
  
  _addErrorMessageToAttribute: function (attribute, message) {
    // console.log('#_addErrorMessageToAttribute', attribute, message);
    
    get(this, 'errors')._add(attribute, message);
  }
});
