import Ember from 'ember';
import FlashMessages from 'ember-cli-flash/services/flash-messages';

const {
  debug
} = Ember;

export default FlashMessages.reopen({
  intl: Ember.inject.service(),
  
  dangerT(key, reason, options) {
    this.clearMessages();
    let message;
    const intl = this.get('intl');
    
    if (reason) {
      if (intl.exists('errors.' + reason)) {
        message = intl.t('errors.' + reason);
      } else {
        debug(`No error specific translation 'errors.${reason}' exists`);
        message = intl.t(key);
      }
    }
    else {
      message = intl.t(key);
    }
    this.danger(message, options);
  },
  
  infoT(key, options) {
    this.clearMessages();
    const message = this.get('intl').t(key);
    this.info(message, options);
  },
  
  successT(key, options) {
    this.clearMessages();
    const message = this.get('intl').t(key);
    this.success(message, options);
  }
});
