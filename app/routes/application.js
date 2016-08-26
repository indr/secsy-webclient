import Ember from 'ember';
import SimpleAuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CustomApplicationRouteMixin from '../mixins/application-route-mixin';

const {
  assign,
  debug,
  K
} = Ember;

export default Ember.Route.extend(SimpleAuthApplicationRouteMixin, CustomApplicationRouteMixin, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  crypto: Ember.inject.service(),
  sharer: Ember.inject.service(),
  addressbook: Ember.inject.service(),
  
  beforeModel()  {
    this.get('session').set('data.isDecrypted', false);
    this.restoreLocale();
  },
  
  restoreLocale() {
    // http://stackoverflow.com/questions/8199760/how-to-get-the-browser-language-using-javascript
    var language = this.get('session').get('data.localeName') || navigator.language || navigator.userLanguage;
    var localeName = ('' + language).toLowerCase().substr(0, 2);
    const names = {'en': 'en-us', 'de': 'de-de'};
    localeName = names[localeName] || 'en-us';
    Ember.debug('Setting locale ' + localeName + ' (detected ' + language + ')');
    this.get('intl').setLocale(localeName);
  },
  
  restoreProgress() {
    this.controller.set('progress.max', 0);
    this.controller.set('progress.type', 'info');
  },
  
  onProgress(status) {
    this.controller.set('progress.value', status.value);
    this.controller.set('progress.max', status.max);
    if (status.value === status.max) {
      this.controller.set('progress.type', 'success');
      Ember.run.later(this.restoreProgress.bind(this), 1000);
    }
  },
  
  clearError() {
    this.render('application');
  },
  
  actions: {
    error: function (error, transition) {
      Ember.Logger.error(error, transition);
      
      // Clear flash messages. Success messages at this point are confusing
      this.get('flashMessages').clearMessages();
      
      // Render template. Remember that {{outlet}} inside error.hbs would render
      // the currents route content
      this.render('error', {
        into: 'application',
        model: error
      });
      
      // More specific errors could be rendered this way
      // Or; Set error.status = error.errors[0].status and handle this in the template
      // if (error.isAdapterError && error.errors && error.errors[0] && error.errors[0].status) {
      //   const status = error.errors[0].status;
      //   this.render('error.404', {
      //     into: 'error'
      //   });
      // }
    },
    
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    modalOpened() {
      this.controller.set('isModal', true);
    },
    
    modalClosed() {
      this.controller.get('isModal', false);
    },
    
    willTransition() {
      this.clearError();
      this.controller.set('isModal', false);
      return this._super(...arguments);
    },
    
    getShares(options) {
      options = assign({silent: false}, options);
      
      debug('routes/application/actions#getShares() / silent:' + options.silent);
      
      const onProgress = options.silent ? K : this.onProgress.bind(this);
      
      // TODO: Error handling
      this.get('sharer').getShares(onProgress).then((shares) => {
        // TODO: Error handling
        return this.get('sharer').digestShares(shares);
      });
    },
    
    onProgress(status) {
      this.onProgress(status);
    },
    
    generateFakes() {
      this.get('addressbook').fake(this.onProgress.bind(this));
    },
    
    clearContacts() {
      this.get('addressbook').clear(this.onProgress.bind(this));
    }
  }
});
