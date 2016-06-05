import Ember from 'ember';

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  beforeModel()  {
    return this.get('intl').setLocale('en-us');
  },
  
  actions: {
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
    }
  }
});
