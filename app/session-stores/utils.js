import Ember from 'ember';

const {
  get
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


function set (obj, keyName, value) {
  const parts = keyName.split('.');
  let partKey = parts[0];
  for (var i = 1; i <= parts.length - 1; i++) {
    if (!has(obj, partKey)) {
      Ember.set(obj, partKey, {});
    }
    partKey = partKey + '.' + parts[i];
  }
  Ember.set(obj, keyName, value);
}

export default {
  del, get, has, set
}
