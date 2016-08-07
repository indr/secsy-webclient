import Ember from 'ember';
import FlashMessages from 'ember-cli-flash/services/flash-messages';

export default FlashMessages.reopen({
  intl: Ember.inject.service(),
  
  dangerT(reason, key) {
    let message;
    const intl = this.get('intl');
    
    if (intl.exists('errors.' + reason)) {
      message = intl.t('errors.' + reason);
    } else {
      message = intl.t(key);
    }
    this.danger(message);
    console.log(reason);
  },
  
  infoT(key) {
    const message = this.get('intl').t(key);
    this.info(message);
  },
  
  successT(key) {
    const message = this.get('intl').t(key);
    this.success(message);
  }
});
