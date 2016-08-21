(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['Fakerator'] };
  }

  define('Fakerator', [], vendorModule);
})();
