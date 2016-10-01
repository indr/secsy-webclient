/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

function debug (message) {
  Ember.debug('[mixin:tracker] ' + message)
}

function setProperty (name, value) {
  if (this.isDestroying || this.isDestroyed) {
    return;
  }
  this.set(name, value);
}

export default Ember.Mixin.create({
  track(setStateProperty, promise) {
    if (arguments.length === 1) {
      promise = setStateProperty;
      setStateProperty = undefined;
    }
    
    debug(setStateProperty ? setStateProperty.name || setStateProperty : 'undefined');
    
    if (!setStateProperty) {
      // setStateProperty = Ember.K;
      return promise;
    } else if (typeof setStateProperty === 'string') {
      setStateProperty = setProperty.bind(this, setStateProperty);
    }
    
    setStateProperty('pending');
    return promise.then((result) => {
      setStateProperty('resolved');
      Ember.run.later(setStateProperty.bind(setStateProperty.this, 'default'), 1500);
      return result;
    }).catch((error) => {
      setStateProperty('rejected');
      Ember.run.later(setStateProperty.bind(setStateProperty.this, 'default'), 1500);
      throw error;
    });
    // Better not use finally cause we might not be dealing with an RSVP promise
  }
});
