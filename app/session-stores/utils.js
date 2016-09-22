import Ember from 'ember';

const {
  get, set
} = Ember;

function del (obj, keyName) {
  const lastIndex = keyName.lastIndexOf('.');
  if (lastIndex > -1) {
    obj = get(obj, keyName.substring(0, lastIndex));
    keyName = keyName.substr(lastIndex + 1);
  }
  
  if (obj) {
    delete obj[keyName];
  }
}

function has (obj, keyName) {
  const lastIndex = keyName.lastIndexOf('.');
  if (lastIndex > -1) {
    obj = get(obj, keyName.substring(0, lastIndex));
    keyName = keyName.substr(lastIndex + 1);
  }
  return obj && obj.hasOwnProperty(keyName);
}

export default {
  del, get, has, set
}
