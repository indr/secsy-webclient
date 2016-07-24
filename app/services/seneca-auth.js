import Ember from 'ember';

const {
  RSVP,
  isEmpty,
  run,
  $: jQuery
} = Ember;

export default Ember.Service.extend({

  register(email, password) {
    return new RSVP.Promise((resolve, reject) => {
      const registerEndpoint = '/auth/register';
      const data = {
        email: email,
        password: password
      };
      const headers = {};
      const useXhr = this.get('rejectWithXhr');

      this._makeRequest(registerEndpoint, data, headers).then((response) => {
        run(() => {
          if (!this._validate(response)) {
            return reject(response['why'] || 'unknown-cause');
          }

          resolve();
        });
      }, (xhr) => {
        run(null, reject, useXhr ? xhr : (xhr.responseJSON || xhr.responseText));
      });
    });
  },

  _makeRequest(url, data, headers = {}) {
    const options = {
      url,
      data: JSON.stringify(data),
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      headers
    };

    if (isEmpty(Object.keys(options.headers))) {
      delete options.headers;
    }

    return jQuery.ajax(options);
  },

  _validate(data) {
    return !isEmpty(data['ok']) && data['ok'] === true;
  }
});
