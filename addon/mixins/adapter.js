import Ember from 'ember';
import Configuration from './../configuration';

export default Ember.Mixin.create({

  /**
    Called by the store in order to fetch a JSON array for all
    of the records for a given filter.
    The `filter` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.
    @method filter
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String|Number} filterId
    @param {Object} query_hash
    @return {Promise} promise
  */
  filter: function(store, type, filterId, query_hash){
    var modelName = type.modelName;
    var url = this.buildURL(modelName, null, null, 'findAll');
    var filterNamespace = Configuration.filterUrlNamespace;
    var filterClass = store.filterFor(modelName);
    var filter = store.peekRecord(filterClass.modelName, filterId);
    if(query_hash){
      return this.ajax(url+'/'+filterNamespace, 'POST', { data: { query_hash: query_hash } });
    }
    else {
      return this.ajax(url+'/'+filterNamespace+'/'+filterId,'GET');
    }

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
