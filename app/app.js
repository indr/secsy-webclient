import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  onError('window.onerror', {
    message: errorMsg,
    stack: typeof errorObj === 'object' ? errorObj.stack : errorObj
  });
};

Ember.onerror = function () {
  onError('Ember.onerror', ...arguments);
};

Ember.RSVP.on('error', function () {
  onError('RSVP.onError', ...arguments);
});

Ember.Logger.error = function () {
  onError('Logger.error', ...arguments);
};

Ember.$.ajaxSetup({
  timeout: 8000
});

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;

function onError (source) {
  console.error(...arguments);
  
  try {
    let report = {
      occuredAt: new Date(),
      source,
      agent: navigator ? navigator.userAgent : null,
      language: navigator ? navigator.language || navigator.userLanguage : null,
    };
    const args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      let each = args[i];
      if (typeof each === 'object') {
        report.instanceOfError = each instanceof Error;
        report.errorName = each.name;
        report.errorMessage = each.message;
        report.errorStack = each.stack;
        break;
      }
    }
    
    const options = {
      url: '/api/error-reports',
      type: 'POST',
      data: JSON.stringify(report),
      dataType: 'json',
      contentType: 'application/json'
    };
    Ember.$.ajax(options);
  } catch (error) {
    console.error('Error reporting error', error);
  }
}
