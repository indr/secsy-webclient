import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete(model) {
      this.sendAction('delete', model);
    },
    
    share(model) {
      this.sendAction('share', model)
    }
  }
});
