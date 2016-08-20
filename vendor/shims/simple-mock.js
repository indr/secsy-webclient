(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['simple'] };
  }

  define('simple-mock', [], vendorModule);
})();
