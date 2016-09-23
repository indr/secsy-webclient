import Ember from 'ember';
import FlashMessages from 'ember-cli-flash/services/flash-messages';

const {
  debug
} = Ember;

export default FlashMessages.reopen({
  intl: Ember.inject.service(),
  
  dangerT(key, error, options) {
    this.clearMessages();
    let message;
    const intl = this.get('intl');
    
    if (error) {
      const errorMessage = typeof error.getMessage === 'function' ? error.getMessage() : (error.message || error);
      if (intl.exists('errors.' + errorMessage)) {
        message = intl.t('errors.' + errorMessage);
      } else {
        debug(`No error specific translation 'errors.${errorMessage}' exists`);
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
