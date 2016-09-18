import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';

export default Ember.Controller.extend(TrackerMixin, {
  lat: 10,
  lng: 0,
  zoom: 2,
  
  showDragAndDropHint: false,
  
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
      model.set('location_latitude$', latlng.lat);
      model.set('location_longitude$', latlng.lng);
      
      this.track(model.save()).catch((err) => {
        // Should we tell the user that this failed?
        Ember.Logger.error('onDragEnd() model.save() failed: ' + (err.message || err));
      });
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
