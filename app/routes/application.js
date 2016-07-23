import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intl: Ember.inject.service('intl'),
  session: Ember.inject.service('session'),

  beforeModel()  {
    return this.get('intl').setLocale('en-us');
  },

  actions: {
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
