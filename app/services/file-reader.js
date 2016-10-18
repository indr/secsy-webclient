/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

const {
  RSVP
} = Ember;

// https://www.html5rocks.com/en/tutorials/file/dndfiles/
export default Ember.Service.extend({
  fileReaderFactory: function () {
    return new window.FileReader();
  },
  
  importFile(file) {
    return new RSVP.Promise((resolve, reject) => {
      
      const reader = this.fileReaderFactory();
      
      reader.onerror = function (file, event) {
        reject(event.target.error);
      }.bind(this, file);
      
      reader.onload = function (file, event) {
        resolve({ file, result: event.target.result });
      }.bind(this, file);
      
      reader.readAsText(file);
    });
  },
  
  importFiles(files) {
    const promises = [];
    for (var i = 0, l = files.length; i < l; i++) {
      promises.push(this.importFile(files[i]));
    }
    return RSVP.all(promises);
  }
});
