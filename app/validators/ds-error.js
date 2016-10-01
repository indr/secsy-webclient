/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import DS from 'ember-data';
import DSError from 'ember-cp-validations/validators/ds-error';
import Ember from 'ember';

const {get, isNone} = Ember;

export default DSError;

DSError.reopen({
  validate(value, options, model, attribute) {
    const errors = get(model, 'errors');
    
    if (!isNone(errors) && errors instanceof DS.Errors && errors.has(attribute)) {
      
      var result = get(errors.errorsFor(attribute), 'lastObject.message');
      
      // Let ember-intl-cp-validations translate the error message
      result = this.createErrorMessage(result, value, options);
      
      // Remove the error from the collection so that during the next validation, that is when the user
      // changed the value, the validation succeeds again, and, thus can be validated against the server again.
      errors._remove(attribute);
      
      return result;
    }
    
    return true;
  }
});
