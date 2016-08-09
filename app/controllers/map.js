import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 10,
  lng: 0,
  zoom: 2,
 
  selectMarker(contact) {
    this.set('lat', contact.get('latitude$'));
    this.set('lng', contact.get('longitude$'));
    this.set('zoom', 8);
  }
});
