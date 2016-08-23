import Ember from 'ember';

export default Ember.Controller.extend({
  locationChanged: Ember.observer('location', function () {
    const location = this.get('location');
    const model = this.get('model');
    
    if (model && model.get('location') === null) {
      model.set('location_latitude$', location.lat);
      model.set('location_longitude$', location.lng);
      
      model.save().catch((err) => {
        this.get('flashMessages').dangerT('errors.save-unknown', err.message || err);
      });
    }
  })
});
