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

  clearFilterStore(){
    this.store.filterStore.clear(this._internalModel.modelName);
  },

  //converting the query_hash to normalized hash
  normalizedQuery: computed('query_hash', {
    get(){
      let $this = this,
        normalizedHash = Ember.Object.create({}),
        filterOptions = get(this, 'filterOptions');
      Ember.assert("Embedded filter expects filterOptions property object (in " + this + ")", Ember.isPresent(filterOptions));
      Object.keys(filterOptions).forEach(function(key){
        let operator = filterOptions[key].operator,
          value = $this.getValueFor(key),
          rawValue = $this.getValueFor(key, false);
        normalizedHash[key] = {
          operator: operator,
          value: value,
          rawValue: rawValue
        };
      });
      return normalizedHash;
    }
  }),

  filterAttribute: function(key){
    return get(this,'filterOptions')[key].attribute || key;
  },

  getValueFor: function(key, normalizedValue=true){
    let attribute = this.filterAttribute(key);
    let modifiedQueryHash = (this.store.restoreFilter(this._internalModel.modelName.replace(this.store.filterPostFix(), "")) || {})["query_hash"];
    let hash = (modifiedQueryHash || []).length > 0 ? modifiedQueryHash : get(this,'query_hash');
    let selectedVal = hash.filterBy('condition',attribute);
    let modifiedQuery = get(this, 'modifiedQuery');
    if(modifiedQuery){
      selectedVal = modifiedQuery.filterBy('condition',attribute);
    }
    if(normalizedValue){
      return Ember.isPresent(selectedVal) ? this.normalizedValue(selectedVal[0], key) : [];
    }
    else{
      return Ember.isPresent(selectedVal) ? selectedVal[0].value : [];
    }
  },

  serializedQuery: function(){
    let $this = this,
        normalizedQuery = get(this, 'normalizedQuery'),
        serializedQuery = [];
    Object.keys(normalizedQuery).forEach(function(key){
      let value = $this.serializeValue(normalizedQuery[key]),
        condition = $this.filterAttribute(key);
      // For promise values on page refresh.
      value = value || normalizedQuery[key].rawValue;
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
      case 'contains_any':
        return object.value.mapBy('id').join();
      default :
        return object.value;
    }
  },

  normalizedValue: function(object, key) {
    let value = object.value;
    switch(object.operator) {
      case 'is_in':
      case 'contains_any':
        value = object.value.split(',');
        break;
      default :
        value = object.value;
    }
    return this[key] ? this[key].call(this, value) : value;
  }
});
