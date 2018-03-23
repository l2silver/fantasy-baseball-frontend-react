// @flow
import prefetch from 'isomorphic-fetch';
import merge from 'deepmerge';

const fetch = function fetch(url, options) {
  return prefetch(url, options)
  .then((resp) => {
    if (resp.status >= 400) {
      throw new Error('Bad response from server');
    }
    return resp.json();
  });
};

// const { MAIN_ADDRESS } = process.env;
const MAIN_ADDRESS = process.env.NODE_ENV === 'development' ? 'http://localhost:8090/' : 'https://fantasy-baseball-20-backend.herokuapp.com/';

const getDefaultOptions = method => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  cache: 'default',
});

export const get = (url: string, options: Object = {}) => fetch(url, merge(options, getDefaultOptions('GET')));
export const put = (url: string, options: Object = {}) => fetch(url, merge(options, getDefaultOptions('PUT')));
export const patch = (url: string, options: Object = {}) => {
  const opts = merge(options, getDefaultOptions('PATCH'));
  return fetch(url, opts);
}
export const post = (url: string, options: Object = {}) => fetch(url, merge(options, getDefaultOptions('POST')));
export const del = (url: string, options: Object = {}) => fetch(url, merge(options, getDefaultOptions('DELETE')));

type $url = string | number;

function processUrl(url) {
  if (!url) {
    return '';
  }
  return `/${url}`;
}

export function getUrl(prefix: string, url?: $url) {
  return `${MAIN_ADDRESS}${prefix}${processUrl(url)}`;
}

export const userUpdate = (playerid, body) => {
  return patch(getUrl('users', playerid), {body: JSON.stringify(body)}).catch(()=>{
    
  });
}