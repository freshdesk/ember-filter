/* global localStorage */
import Ember from 'ember';
import Base from 'ember-filter/filter-stores/base';
import LocalStorage from 'ember-filter/filter-stores/local-storage';
import Cookie from 'ember-filter/filter-stores/cookie';

const { computed, on } = Ember;

const LOCAL_STORAGE_TEST_KEY = '_ember_filter_test_key';

/**
  Filter store that persists data in the browser's `localStorage` (see
  {{#crossLink "LocalStorageStore"}}{{/crossLink}}) if that is available or in
  a cookie (see {{#crossLink "CookieStore"}}{{/crossLink}}) if it is not.

  __This is the default store that Ember Filter will use when the
  application doesn't define a custom store.__

  @class AdaptiveStore
  @module ember-filter/filter-stores/adaptive
  @extends BaseStore
  @public
*/
export default Base.extend({
  /**
    The `localStorage` key the store persists data in if `localStorage` is
    available.

    @property localStorageKey
    @type String
    @default 'ember_filter:filter'
    @public
  */
  localStorageKey: 'ember_filter:filter',

  /**
    The domain to use for the cookie if `localStorage` is not available, e.g.,
    "example.com", ".example.com" (which includes all subdomains) or
    "subdomain.example.com". If not explicitly set, the cookie domain defaults
    to the domain the filter was accessed.

    @property cookieDomain
    @type String
    @default null
    @public
  */
  cookieDomain: null,

  /**
    The name of the cookie to use if `localStorage` is not available.

    @property cookieName
    @type String
    @default ember_filter:filter
    @public
  */
  cookieName: 'ember_filter:filter',

  /**
    The expiration time for the cookie in seconds if `localStorage` is not
    available. A value of `null` will make the cookie a filter cookie that
    expires and gets deleted when the browser is closed.

    @property cookieExpirationTime
    @default null
    @type Integer
    @public
  */
  cookieExpirationTime: null,

  _isLocalStorageAvailable: computed(function() {
    try {
      localStorage.setItem(LOCAL_STORAGE_TEST_KEY, true);
      localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
      return true;
    } catch(e) {
      return false;
    }
  }),

  _createStore(storeType, options) {
    const store = storeType.create(options);
    store.on('filterDataUpdated', (data) => {
      this.trigger('filterDataUpdated', data);
    });
    return store;
  },

  _setupStore: on('init', function() {
    let store;
    if (this.get('_isLocalStorageAvailable')) {
      const options = { key: this.get('localStorageKey') };
      store = this._createStore(LocalStorage, options);
    } else {
      const options = this.getProperties('cookieDomain', 'cookieName', 'cookieExpirationTime');
      store = this._createStore(Cookie, options);
    }
    this.set('_store', store);
  }),

  /**
    Persists the `data` in the `localStorage` if it is available or in a cookie
    if it is not.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist() {
    this.get('_store').persist(...arguments);
  },

  /**
    Returns all data currently stored in the `localStorage` if that is
    available - or if it is not, in the cookie - as a plain object.

    @method restore
    @return {Object} The data currently persisted in the `localStorage`.
    @public
  */
  restore() {
    return this.get('_store').restore();
  },


  /**
    Returns filter data currently stored in the store as a plain object.

    @method restoreFor
    @param {String} filterClass
    @return {Object} The data currently persisted in the cookie.
    @public
  */
  restoreFor() {
    return this.get('_store').restoreFor(...arguments);
  },

  /**
    Clears the store by deleting the
    {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
    `localStorage` if that is available or by deleting the cookie if it is not.

    @method clear
    @public
  */
  clear() {
    this.get('_store').clear(...arguments);
  }
});
