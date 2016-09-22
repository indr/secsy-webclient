// https://github.com/ProtonMail/WebClient/blob/public/src/app/libraries/pmcrypto.js
// https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js

import Ember from 'ember';

const {
  get, set
} = Ember;

export default {
  getRandomValues,
  
  encode_base64,
  decode_base64,
  
  arrayToBinaryString,
  binaryStringToArray,
  
  del,
  get,
  has,
  set
}

let crypto;
if (window.crypto && window.crypto.getRandomValues) {
  crypto = window.crypto;
} else if (window.msCrypto && window.msCrypto.getRandomValues) {
  crypto = window.msCrypto;
}

function getRandomValues (arr) {
  if (!crypto) {
    throw new Error('Browser does not support getRandomValues()');
  }
  return crypto.getRandomValues(arr);
}

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

function encode_base64 (data) {
  if (data !== undefined) {
    return btoa(data).trim();
  }
}

function decode_base64 (data) {
  if (data !== undefined) {
    return atob(data.trim());
  }
}

function binaryStringToArray (str) {
  var bytes = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

function arrayToBinaryString (arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = String.fromCharCode(arr[i]);
  }
  return result.join('');
}
