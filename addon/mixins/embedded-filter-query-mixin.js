import Ember from 'ember';
const { computed, get, set } = Ember;

export default Ember.Mixin.create({
  //To check the status of filter
  queryModified: computed('modifiedQuery', function(){
    return !!this.get('modifiedQuery');
  }),

  modifiedQuery: null,

  discard(){
    set(this, 'queryModified', false);
    set(this, 'modifiedQuery', null);
    this.store.updateStore(this.id, this._internalModel.modelName, null);
    this.notifyPropertyChange('normalizedQuery');
  },

  //converting the query_hash to normalized hash
  normalizedQuery: computed('query_hash', {
    get(key){
      let $this = this,
        normalizedHash = Ember.Object.create({}),
        filterOptions = get(this, 'filterOptions');
      Ember.assert("Embedded filter expects filterOptions property object (in " + this + ")", Ember.isPresent(filterOptions));
      Object.keys(filterOptions).forEach(function(key){
        let operator = filterOptions[key].operator,
          value = $this.getValueFor(key);
        normalizedHash[key] = {
          operator: operator,
          value: value
        };
      });
      return normalizedHash;
    }
  }),

  filterAttribute: function(key){
    return get(this,'filterOptions')[key].attribute || key;
  },

  getValueFor: function(key){
    let attribute = this.filterAttribute(key);
    let selectedVal = get(this,'query_hash').filterBy('condition',attribute);
    let modifiedQuery = get(this, 'modifiedQuery');
    if(modifiedQuery){
      selectedVal = modifiedQuery.filterBy('condition',attribute);
    }
    return Ember.isPresent(selectedVal) ? this.normalizedValue(selectedVal[0], key) : [];
  },

  serializedQuery: function(){
    let $this = this,
        normalizedQuery = get(this, 'normalizedQuery'),
        serializedQuery = [],
        filterOptions = get(this, 'filterOptions');
    Object.keys(normalizedQuery).forEach(function(key){
      let value = $this.serializeValue(normalizedQuery[key]),
        condition = $this.filterAttribute(key);
      if(Ember.isPresent(value)) {
        serializedQuery.push({
          condition: condition,
          operator: normalizedQuery[key].operator,
          value: value
        });
      }
    });
    return serializedQuery;
  },

  serializeValue: function(object){
    switch(object.operator) {
      case 'is_in':
        return object.value.mapBy('id').join();
      default :
        return object.value;
    }
  },

  normalizedValue: function(object, key) {
    let value = object.value;
    switch(object.operator) {
      case 'is_in':
        value = object.value.split(',');
        break;
      default :
        value = object.value;
    }
    return this[key] ? this[key].call(this, value) : value;
  }
});
