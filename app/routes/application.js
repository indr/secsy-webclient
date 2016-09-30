import Ember from 'ember';
import CustomApplicationRouteMixin from '../mixins/application-route-mixin';
import SimpleAuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import TrackerMixin from './../mixins/tracker-mixin';

const {
  assign,
  K
} = Ember;

function debug (message) {
  Ember.debug('[route:application] ' + message);
}

export default Ember.Route.extend(SimpleAuthApplicationRouteMixin, CustomApplicationRouteMixin, TrackerMixin, {
  flashMessages: Ember.inject.service(),
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  updatePuller: Ember.inject.service('update-puller'),
  
  beforeModel()  {
    const noSsl = window.location.href.indexOf('https') !== 0 && window.location.href.indexOf('http://localhost') !== 0;
    if (noSsl) {
      Ember.run.later(function () {
        window.location.href = 'https' + window.location.href.substr(4);
      }, 1500);
    }
    
    this.get('session').set('data.authenticated.decrypted', false);
    this.restoreLocale();
  },
  
  restoreLocale() {
    // http://stackoverflow.com/questions/8199760/how-to-get-the-browser-language-using-javascript
    var language = this.get('session').get('data.localeName') || navigator.language || navigator.userLanguage;
    var localeName = ('' + language).toLowerCase().substr(0, 2);
    const names = {'en': 'en-US', 'de': 'de-DE'};
    localeName = names[localeName] || 'en-US';
    debug('Setting locale ' + localeName + ' (detected ' + language + ')');
    this.get('intl').setLocale(localeName);
  },
  
  onProgress(status) {
    this.controller.onProgress(status);
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
      debug('setLocale ' + localeName);
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
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
    
    pullUpdates(options, stateProperty) {
      if (!this.get('session').get('data.authenticated.sync_enabled')) {
        return
      }
      
      options = assign({silent: false}, options);
      const flashMessages = this.get('flashMessages');
      
      const emailAddress = this.get('session').get('data.authenticated.email');
      const onProgress = options.silent ? K : this.onProgress.bind(this);
      
      try {
        return this.track(stateProperty, this.get('updatePuller').pull(emailAddress, onProgress)).catch((error) => {
          flashMessages.dangerT('pull-updates.unknown-error', error);
        });
      } catch (error) {
        flashMessages.dangerT('pull-updates.unknown-error', error);
      }
    },
    
    onProgress(status) {
      this.onProgress(status);
    },
    
    openSearch() {
      this.controller.openSearch();
    },
    
    closeSearch() {
      this.controller.closeSearch();
    }
  }
});
