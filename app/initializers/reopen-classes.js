/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

/*jshint unused:false*/
import DSError from './../validators/ds-error';
import Format from './../validators/format';
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
