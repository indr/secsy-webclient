import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      this.sendAction('save');
    },
    cancel() {
      this.sendAction('cancel');
    },
    removeCoordinate() {
      this.get('model').set('location_latitude$', null);
      this.get('model').set('location_longitude$', null);
    }
  }
});
