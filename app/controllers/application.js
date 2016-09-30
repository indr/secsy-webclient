import Ember from 'ember';

// function debug (message) {
//   Ember.debug('[controller:application] ' + message);
// }

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  noSsl: window.location.href.indexOf('https') !== 0 && window.location.href.indexOf('http://localhost') !== 0,
  
  isModal: false,
  
  isSearchOpen: false,
  
  canSearch: Ember.computed('currentPath', function () {
    const currentPath = this.get('currentPath');
    return (currentPath === 'contacts.index') || (currentPath.indexOf('map') === 0);
  }),
  
  isSearchVisible: Ember.computed.and('isSearchOpen', 'canSearch'),
  
  isProgressVisible: Ember.computed.and('progresses', 'progresses.length'),
  
  isToolbarVisible: Ember.computed.or('isSearchVisible', 'isProgressVisible'),
  
  _progresses: {},
  progresses: Ember.A(),
  
  openSearch() {
    if (!this.get('canSearch')) {
      return;
    }
    this.set('isSearchOpen', true);
  },
  
  closeSearch() {
    this.set('isSearchOpen', false);
  },
  
  onProgress(status) {
    const id = status.id || 'default';
    let progress = this._progresses[id];
    
    if (!progress) {
      progress = Ember.Object.create();
      progress.set('type', 'info');
      this._progresses[id] = progress;
      this.progresses.addObject(progress);
    }
    
    progress.set('value', status.value);
    progress.set('max', status.max);
    if (status.done && status.value !== status.max) {
      progress.set('type', 'danger');
      Ember.run.later(this.removeProgress.bind(this, id), 1000);
    } else if (status.done || status.value === status.max) {
      progress.set('type', 'success');
      Ember.run.later(this.removeProgress.bind(this, id), 1000);
    }
  },
  
  removeProgress(id) {
    let progress = this._progresses[id];
    if (!progress) {
      return;
    }
    
    this.progresses.removeObject(progress);
    delete this._progresses[id];
  }
});
