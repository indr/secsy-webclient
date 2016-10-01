/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

const {
  assert,
  RSVP,
  run
} = Ember;

assert('RSVP.Promise.method is already defined', RSVP.Promise.method === undefined);
assert('RSVP.promiseFor is already defined', RSVP.methodFor === undefined);

export default RSVP;

var throwToggle = false;
RSVP.Promise.prototype.throwToggle = function () {
  Ember.warn('You are using the throw toggler. Don\'t use this in production! Promise? ;)', false,
    {id: 'secsy-debug.promise-throw-toggle'});
  return this.then(function (result) {
    throwToggle = !throwToggle;
    if (!throwToggle) {
      throw new Error('Throw toggle');
    }
    return result;
  });
};

RSVP.Promise.prototype.delay = function (ms, value) {
  return this.then(function (result) {
    return new RSVP.Promise(function (resolve) {
      Ember.debug('Delaying promise for ' + ms + ' ms');
      run.later(resolve.bind(null, value || result), ms);
    });
  });
};

/**
 * Returns a new function that wraps the given function fn. The new function will always return a promise that is
 * fulfilled with the original functions return values or rejected with thrown exceptions from the original function.
 *
 * This method is convenient when a function can sometimes return synchronously or throw synchronously.
 *
 * See http://bluebirdjs.com/docs/api/promise.method.html
 *
 * @param fn
 * @returns {Function}
 */
RSVP.Promise.method = function (fn) {
  return function () {
    return new RSVP.Promise((resolve, reject) => {
      try {
        resolve(fn(...arguments));
      }
      catch (error) {
        reject(error);
      }
    });
  };
};

// See http://stackoverflow.com/questions/24660096/correct-way-to-write-loops-for-promise
RSVP.promiseFor = RSVP.Promise.method(function (aggregate, condition, action, value) {
  if (!condition(value)) {
    return aggregate;
  }
  return action(value, aggregate).then(function (result) {
    return new RSVP.Promise(function (resolve) {
      run.later(resolve.bind(this, result), 1);
    });
  }).then(RSVP.promiseFor.bind(null, aggregate, condition, action));
});
