import Ember from 'ember';

/**
  The base class for all filter stores. __This serves as a starting point for
  implementing custom filter stores and must not be used directly.__

  Filter Stores persist the filter's state so that it survives a page reload
  and is synchronized across multiple tabs or windows of the same application.

  @class BaseStore
  @module ember-filter/filter-stores/base
  @extends Ember.Object
  @uses Ember.Evented
  @public
*/
export default Ember.Object.extend(Ember.Evented, {

  /**
    Persists the `data`. This replaces all currently stored data.

    `BaseStores`'s implementation does nothing. __This method must be
    overridden in subclasses__.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist() {},

  /**
    Returns all data currently stored as a plain object.

    `BaseStores`'s implementation returns an empty object. __This method must
    be overridden in subclasses__.

    @method restore
    @return {Object} The data currently persisted in the store.
    @public
  */
  restore() {
    return {};
  },

  /**
    Clears the store.

    `BaseStores`'s implementation does nothing. __This method must be
    overridden in subclasses__.

    @method clear
    @public
  */
  clear() {}
});
