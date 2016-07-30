import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  keyring: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeyringEvents();
  },
  
  beforeModel()  {
    this.restoreLocale();
  },
  
  restoreLocale() {
    const localeName = this.get('session').get('data.localeName') || 'en-us';
    this.get('intl').setLocale(localeName);
  },
  
  actions: {
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    }
  },
  
  keyringOpened() {
    this.transitionTo('contacts');
  },
  
  _subscribeToKeyringEvents() {
    this.get('keyring').on('keyringOpened',
      Ember.run.bind(this, () => {
        this['keyringOpened'](...arguments);
      })
    );
  }
});
