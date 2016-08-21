/*jshint unused:false*/
import DSError from './../validators/ds-error';
import Session from './../services/session';

/**
 * https://duckduckgo.com/?q=ember+where+to+put+reopen&t=ffab&ia=web
 * http://discuss.emberjs.com/t/where-to-put-a-call-to-something-reopen/7385
 * http://stackoverflow.com/questions/27154886/ember-cli-where-to-reopen-framework-classes
 */

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'reopen-classes',
  initialize
};
