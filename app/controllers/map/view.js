import Ember from 'ember';

export default Ember.Controller.extend({
  locationChanged: Ember.observer('location', function () {
    const location = this.get('location');
    const model = this.get('model');
    if (model && model.get('location') === null) {
      model.set('latitude$', location.lat);
      model.set('longitude$', location.lng);
      model.save();
    }
  })
});
