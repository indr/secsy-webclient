/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

/* global self, define */

(function () {
  function vendorModule () {
    'use strict';
    
    return {'default': self['Fakerator']};
  }
  
  define('Fakerator', [], vendorModule);
})();
