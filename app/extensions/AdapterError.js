import DS from 'ember-data';

DS.AdapterError.prototype.getMessage = function () {
  return this.errors[0] ? this.errors[0].message || this.errors[0].detail : this.message;
};

export default DS.AdapterError;
