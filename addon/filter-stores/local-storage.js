/* global localStorage */
import $ from 'jquery';

import { on } from '@ember/object/evented';
import BaseStore from './base';

/**
  Filter store that persists data in the browser's `localStorage`.

  __`localStorage` is not available in Safari when running in private mode. In
  general it is better to use the
  {{#crossLink "AdaptiveStore"}}{{/crossLink}} that automatically falls back to
  the {{#crossLink "CookieStore"}}{{/crossLink}} when `localStorage` is not
  available.__

  @class LocalStorageStore
  @module ember-filter/filter-stores/local-storage
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  /**
    The `localStorage` key the store persists data in.

    @property key
    @type String
    @default 'ember_filter:filter'
    @public
  */
  key: 'ember_filter:filter',

  _setup: on('init', function() {
    this._bindToStorageEvents();
  }),

  /**
    Persists the `data` in the `localStorage`.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(filterClass, data) {
    let content = this.restore();
    content[filterClass] = data;
    content        = JSON.stringify(content || {});
    localStorage.setItem(this.key, content);
    this._lastData = this.restore();
  },

  /**
    Returns all data currently stored in the `localStorage` as a plain object.

    @method restore
    @return {Object} The data currently persisted in the `localStorage`.
    @public
  */
  restore() {
    let data = localStorage.getItem(this.key);
    return JSON.parse(data) || {};
  },

  /**
    Returns filter data currently stored in the store as a plain object.

    @method restoreFor
    @param {String} filterClass
    @return {Object} The data currently persisted in the cookie.
    @public
  */
  restoreFor(filterClass) {
    return this.restore()[filterClass];
  },

  /**
    Clears the store by deleting the
    {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
    `localStorage`.

    @method clear
    @public
  */
  clear(filterClass) {
    let content = this.restoreFor(filterClass);
    content[filterClass] = null;
    content = JSON.stringify(content || {});
    localStorage.setItem(this.key, content);
    this._lastData = {};
  },

  _bindToStorageEvents() {
    $(window).bind('storage', () => {
      let data = this.restore();
      this._lastData = data;
      this.trigger('filterDataUpdated', data);
    });
  }
});
