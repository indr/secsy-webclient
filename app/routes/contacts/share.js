import Ember from 'ember';

export default Ember.Route.extend({
  flashMessages: Ember.inject.service(),
  session: Ember.inject.service(),
  updatePusher: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    share(properties) {
      const emailAddress = this.get('session').get('data.authenticated.email');
      const progressCb = this.send.bind(this, 'onProgress');
      
      try {
        return this.get('updatePusher').push(properties, emailAddress, progressCb).then(() => {
          this.transitionTo('contacts.view', this.controller.get('model'));
        }).catch((err) => {
          this.get('flashMessages').dangerT('share.unknown-error', err.message || err);
        });
      } catch (err) {
        this.get('flashMessages').danger(err.message || err);
      }
    },
    
    cancel() {
      const model = this.controller.get('model');
      this.transitionTo('contacts.view', model);
    }
  }
});
