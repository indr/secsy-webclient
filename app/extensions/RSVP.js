import Ember from 'ember';

const {
  assert,
  RSVP,
  run
} = Ember;

assert('RSVP.Promise.method is already defined', RSVP.Promise.method === undefined);
assert('RSVP.promiseFor is already defined', RSVP.methodFor === undefined);

export default RSVP;

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
      catch (err) {
        reject(err);
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