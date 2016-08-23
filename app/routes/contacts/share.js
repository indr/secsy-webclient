import Ember from 'ember';

export default Ember.Route.extend({
  sharer: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    share(properties) {
      const sharer = this.get('sharer');
      const flashMessages = this.get('flashMessages');
      
      sharer.share(properties, this.send.bind(this, 'onProgress')).then(() => {
        Ember.run.later(flashMessages.successT.bind(flashMessages, 'share.successful'), 1200);
        this.transitionTo('contacts.view', this.controller.get('model'));
      }).catch((err) => {
        flashMessages.dangerT('share.unknown-error', err.message || err);
      });
    },
    
    cancel() {
      const model = this.controller.get('model');
      this.transitionTo('contacts.view', model);
    }
  }
});
