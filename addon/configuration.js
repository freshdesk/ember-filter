import { typeOf } from '@ember/utils';
import EmberObject from '@ember/object';

const DEFAULTS = {
  filterUrlNamespace:      'filters',
  filterModelEndsWith:     '-filter'
};

/**
  Ember Filters's configuration object.

  To change any of these values, set them on the application's environment
  object, e.g.:

  ```js
  // config/environment.js
  ENV['ember-filter'] = {
    filterUrlNamespace: 'views',
    filterModelEndsWith: '-view'
  };
  ```

  @class Configuration
  @extends Object
  @module ember-filter/configuration
  @public
*/
export default {

  /**
    The url namespace to hit for server response.

    @property filterUrl
    @readOnly
    @static
    @type String
    @default 'filters'
    @public
  */
  filterUrlNamespace: DEFAULTS.filterUrlNamespace,

  /**
    The filter model postfix for getting the respective filter model.

    @property filterModelEndsWith
    @readOnly
    @static
    @type String
    @default '-filter'
    @public
  */
  filterModelEndsWith: DEFAULTS.filterModelEndsWith,

  load(config) {
    const wrappedConfig = EmberObject.create(config);
    for (let property in this) {
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        this[property] = wrappedConfig.getWithDefault(property, DEFAULTS[property]);
      }
    }
  }
};
