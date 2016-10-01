/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

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
  
  /**
   * Sets translated error message to attributes based on contents of `err`.
   *
   * @param err {DS.Error}
   * @param options {Object}
   * @returns {Promise}
   *
   * Resolves if there is at least one invalid validation.
   * Rejects otherwise with the original err argument.
   */
  handleValidationErrors: function (err, options) {
    var hash = errorsArrayToHash(err.errors);
    
    this._adapterDidInvalidate(hash, options || {});
    
    // Trigger revalidate of all validators, not only ds-error because dependent validators should also be
    // revalidated
    return this.validate().then(() => {
      if (this.get('validations.isInvalid')) {
        // Resolve promise if ds-error caused validations to fail
        return;
      }
      // Throw original err object cause ds-error didn't invalidate
      throw err;
    });
  },
  
  _errorsArrayToHash: errorsArrayToHash,
  
  /**
   *
   * @param errors
   * @param options
   * @private
   */
  _adapterDidInvalidate: function (errors, options) {
    var attribute;
    
    for (attribute in errors) {
      if (errors.hasOwnProperty(attribute)) {
        this._addErrorMessageToAttribute(options[attribute] || attribute, errors[attribute]);
      }
    }
  },
  
  _addErrorMessageToAttribute: function (attribute, message) {
    get(this, 'errors')._add(attribute, message);
  }
});
