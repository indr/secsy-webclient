import Ember from 'ember';

// http://stackoverflow.com/questions/10232574/handlebars-js-parse-object-instead-of-object-object

export function json(params/*, hash*/) {
  return JSON.stringify(params);
}

export default Ember.Helper.helper(json);
