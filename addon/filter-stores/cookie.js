import Ember from 'ember';
import BaseStore from './base';

const { computed } = Ember;

const { on } = Ember;

/**
  Filter store that persists data in a cookie.

  By default the cookie session store uses a filter cookie that expires and is
  deleted when the browser is closed. The cookie expiration period can be
  configured by setting the
  {{#crossLink "CookieStore/cookieExpirationTime:property"}}{{/crossLink}}
  property. This can be used to implement "remember me" functionality that will
  either store the filter persistently or in a filter cookie depending on
  whether the user opted in or not:

  ```js
  // app/controllers/filter/index.js
  export default Ember.Controller.extend({

    _sessionChanged: Ember.observer('session.isAuthenticated', function() {
      const expirationTime = this.get('session.store.cookieExpirationTime');
      this.set('store.filterStore.cookieExpirationTime', expirationTime);
    }
  });
  ```

*/
export default BaseStore.extend({
  /**
    The domain to use for the cookie, e.g., "example.com", ".example.com"
    (which includes all subdomains) or "subdomain.example.com". If not
    explicitly set, the cookie domain defaults to the domain the filter was
    accessed.

    @property cookieDomain
    @type String
    @default null
    @public
  */
  cookieDomain: null,

  /**
    The name of the cookie.

    @property cookieName
    @type String
    @default ember_filter:filter
    @public
  */
  cookieName: 'ember_filter:filter',

  /**
    The expiration time for the cookie in seconds. A value of `null` will make
    the cookie a filter cookie that expires and gets deleted when the browser
    is closed.

    @property cookieExpirationTime
    @default null
    @type Integer
    @public
  */
  cookieExpirationTime: null,

  _secureCookies: window.location.protocol === 'https:',

  _syncDataTimeout: null,

  _renewExpirationTimeout: null,

  _isPageVisible: computed(function() {
    const visibilityState = document.visibilityState || 'visible';
    return visibilityState === 'visible';
  }).volatile(),

  _setup: on('init', function() {
    this._syncData();
    this._renewExpiration();
  }),

  /**
    Persists the `data` in the cookie.

    @method persist
    @param {String} filterClass
    @param {Object} data The data to persist
    @public
  */
  persist(filterClass, data) {
    let content = this.restore();
    content[filterClass] = data;
    content        = JSON.stringify(content || {});
    let expiration = this._calculateExpirationTime();
    this._write(content, expiration);
    this._lastData = this.restore();
  },

  /**
    Returns all data currently stored in the cookie as a plain object.

    @method restore
    @return {Object} The data currently persisted in the cookie.
    @public
  */
  restore() {
    let data = this._read(this.cookieName);
    if (Ember.isEmpty(data)) {
      return {};
    } else {
      return JSON.parse(data);
    }
  },

  /**
    Returns filter data currently stored in the cookie as a plain object.

    @method restore
    @param {String} filterClass
    @return {Object} The data currently persisted in the cookie.
    @public
  */
  restoreFor(filterClass) {
    return this.restore()[filterClass];
  },

  /**
    Clears the store by deleting the cookie.

    @method clear
    @public
  */
  clear() {
    this._write(null, 0);
    this._lastData = {};
  },

  _read(name) {
    let value = document.cookie.match(new RegExp(`${name}=([^;]+)`)) || [];
    return decodeURIComponent(value[1] || '');
  },

  _calculateExpirationTime() {
    let cachedExpirationTime = this._read(`${this.cookieName}:expiration_time`);
    cachedExpirationTime     = !!cachedExpirationTime ? new Date().getTime() + cachedExpirationTime * 1000 : null;
    return !!this.cookieExpirationTime ? new Date().getTime() + this.cookieExpirationTime * 1000 : cachedExpirationTime;
  },

  _write(value, expiration) {
    let path        = '; path=/';
    let domain      = Ember.isEmpty(this.cookieDomain) ? '' : `; domain=${this.cookieDomain}`;
    let expires     = Ember.isEmpty(expiration) ? '' : `; expires=${new Date(expiration).toUTCString()}`;
    let secure      = !!this._secureCookies ? ';secure' : '';
    document.cookie = `${this.cookieName}=${encodeURIComponent(value)}${domain}${path}${expires}${secure}`;
    if (expiration !== null) {
      let cachedExpirationTime = this._read(`${this.cookieName}:expiration_time`);
      document.cookie = `${this.cookieName}:expiration_time=${encodeURIComponent(this.cookieExpirationTime || cachedExpirationTime)}${domain}${path}${expires}${secure}`;
    }
  },

  _syncData() {
    let data = this.restore();
    this._lastData = data;
    this.trigger('filterDataUpdated', data);
    if (!Ember.testing) {
      Ember.run.cancel(this._syncDataTimeout);
      this._syncDataTimeout = Ember.run.later(this, this._syncData, 500);
    }
  },

  _renew() {
    let data = this.restore();
    if (!Ember.isEmpty(data) && data !== {}) {
      data           = Ember.typeOf(data) === 'string' ? data : JSON.stringify(data || {});
      let expiration = this._calculateExpirationTime();
      this._write(data, expiration);
    }
  },

  _renewExpiration() {
    if (this.get('_isPageVisible')) {
      this._renew();
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._renewExpirationTimeout);
      this._renewExpirationTimeout = Ember.run.later(this, this._renewExpiration, 60000);
    }
  }
});
