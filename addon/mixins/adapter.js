import Ember from 'ember';
import Configuration from './../configuration';

export default Ember.Mixin.create({

  /**
    Called by the store in order to fetch a JSON array for all
    of the records for a given filter.
    The `filter` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.
    ``js
    #additional query can be passed in options as
      {
        query : {
          day: 'sunday',
          month: 'Jan'
        }
      }
    ``
    @method filter
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String|Number} filterId
    @param {Object} query_hash
    @param {Object} options
    @return {Promise} promise
  */
  filter: function(store, type, filterId, query_hash, options){
    var options = Ember.copy(options, true);
    var modelName = type.modelName;
    var url = this.buildURL(modelName, null, null, 'findAll', query_hash);
    var data = Ember.copy(options.queryParams, true) || {};
    data['filter_id'] = filterId;
    if(query_hash){
      data['query_hash'] = query_hash;
    }
    if(options.query) {
      Ember.merge(data, options.query);
    }
    return this.ajax(url, 'GET', { data: data });
  },
  /**
    Called by the store in order to fetch a JSON array filter response.
    @method handleFilterResponse
    @param {DS.Model} type
    @param {Object} payload
    @return {Object} payload
  */
  handleFilterResponse: function(type, payload){
    var camelized = Ember.String.camelize(type);
    return payload[Ember.String.pluralize(camelized)];
  }
});
