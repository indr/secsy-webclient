import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 10,
  lng: 0,
  zoom: 2,
  
  // Usually, when a popup is closed, we want to leave
  // the child route map.view (/map/;id) and go to the parent.
  doTransitionOnClosed: true,
  
  openPopup(contact) {
    contact.set('popupOpen', true);
  },
  
  closePopup() {
    if (this._openPopup) {
      this._openPopup.set('popupOpen', false);
    }
  },
  
  setCenter(location, zoom) {
    if (location) {
      this.set('lat', location[0]);
      this.set('lng', location[1]);
      if (zoom) {
        this.set('zoom', zoom);
      }
    }
  },
  
  actions: {
    onMapClick(mouseEvent) {
      this.send('mapClicked', mouseEvent);
    },
   
    onDragEnd(model, dragEndEvent) {
      const latlng = dragEndEvent.target._latlng;
      model.set('latitude$', latlng.lat);
      model.set('longitude$', latlng.lng);
      // TODO: Error handling
      model.save();
    },
    
    popupOpened(contact) {
      this.doTransitionOnClosed = true;
      this._openPopup = contact;
      this.transitionToRoute('map.view', contact);
    },
    
    popupClosed(/*contact*/) {
      if (this.doTransitionOnClosed) {
        this.transitionToRoute('map');
      }
    }
  }
});
