import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 10,
  lng: 0,
  zoom: 2,
 
  selectMarker(contact) {
    this.set('lat', contact.get('latitude$'));
    this.set('lng', contact.get('longitude$'));
    this.set('zoom', this.get('zoom'));
  },
  
  actions: {
    markerClicked(contact) {
      // https://github.com/miguelcobain/ember-leaflet/issues/48
      // console.log('conroller/markerClicked', contact.id);
      this.transitionToRoute('map.view', contact);
    }
  }
});
