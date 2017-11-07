import ENV from '../config/environment';
import Configuration from 'ember-filter/configuration';

export default {
  name:       'ember-filter',
  initialize: function() {
    const config = ENV['ember-filter'] || {};
    Configuration.load(config);
  }
};
