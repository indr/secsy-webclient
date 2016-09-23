import Ember from 'ember';

export default Ember.Controller.extend({
  setLocation(location) {
    const model = this.get('model');
    
    if (model && model.get('location') === null) {
      model.set('location_latitude$', location.lat);
      model.set('location_longitude$', location.lng);
      
      return model.save().catch((error) => {
        this.get('flashMessages').dangerT('errors.save-unknown', error);
      });
    }
  }
});
