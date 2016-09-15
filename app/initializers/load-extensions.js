/*jshint unused:false*/
import AdapterError from './../extensions/AdapterError';
import BsFormElement from './../extensions/bs-form-element';
import Model from './../extensions/Model';
import RSVP from './../extensions/RSVP';

export function initialize (/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'load-extensions',
  initialize
};
