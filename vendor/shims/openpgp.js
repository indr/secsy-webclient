(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['openpgp'] };
  }

  define('openpgp', [], vendorModule);
})();
