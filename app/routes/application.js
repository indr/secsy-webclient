import Ember from 'ember';
import SimpleAuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CustomApplicationRouteMixin from '../mixins/application-route-mixin';

export default Ember.Route.extend(SimpleAuthApplicationRouteMixin, CustomApplicationRouteMixin, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  crypto: Ember.inject.service(),
  sharer: Ember.inject.service(),
  
  beforeModel()  {
    this.restoreLocale();
  },
  
  restoreLocale() {
    const localeName = this.get('session').get('data.localeName') || 'en-us';
    this.get('intl').setLocale(localeName);
  },
  
  restoreProgress() {
    this.controller.set('progress.max', 0);
    this.controller.set('progress.type', 'info');
  },
  
  actions: {
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    getShares() {
      this.get('sharer').getShares().then((shares) => {
        return this.get('sharer').digestShares(shares);
      }).then(() => {
        console.log('loaded and digested');
      });
    },
    
    onProgress(status) {
      this.controller.set('progress.value', status.value);
      this.controller.set('progress.max', status.max);
      if (status.value === status.max) {
        this.controller.set('progress.type', 'success');
        Ember.run.later(this.restoreProgress.bind(this), 1000);
      }
    }
  }
});
