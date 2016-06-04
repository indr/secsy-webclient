import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    name: validator('presence', true)
});

export default Model.extend(Validations, {
    name: attr(),
    emailAddress: attr(),
    phoneNumber: attr()
});


