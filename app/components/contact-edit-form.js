import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      this.sendAction('save');
    },
    cancel() {
      this.sendAction('cancel');
    },
    delete() {
      this.sendAction('delete');
    },
    share() {
      this.sendAction('share');
    }
  }
});
