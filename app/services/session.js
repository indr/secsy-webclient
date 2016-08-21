import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

export default Session.reopen({
  /**
   * Returns whether the session is currently decrypted.
   *
   * @property isDecrypted
   * @type Boolean
   * @readOnly
   * @default false
   * @public
   */
  isDecrypted: Ember.computed.and('isAuthenticated', 'data.isDecrypted'),
});
