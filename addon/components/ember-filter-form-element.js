import Ember from 'ember';
import layout from '../templates/components/ember-filter-form-element';
const { computed, get, set  } = Ember;

export default Ember.Component.extend({
  layout: layout,
  selectize: computed(function(){
    var options = get(this, 'options');
    return options.type === 'selectize';
  }),
  multiple: computed(function(){
    var options = get(this, 'options');
    return options.type === 'selectize' && options.operator === 'is_in';
  }),
  dropdown: computed(function(){
    var options = get(this, 'options');
    return options.type === 'dropdown';
  }),
  checkbox: computed(function(){
    var options = get(this, 'options');
    return options.type === 'checkbox';
  }),
  text: computed(function(){
    var options = get(this, 'options');
    return options.type === 'text';
  }),
  choices: computed(function(){
    var filter = get(this, 'filter');
    var key = get(this, 'key');
    var options = get(this, 'options');
    return  get(options, 'choices') || get(filter, this.contentMethod(key));
  }),
  value: computed('filter.normalizedQuery',{
    get: function(){
      var filter = get(this, 'filter');
      var key = get(this, 'key');
      var options = get(this, 'options');
      return get(filter, 'normalizedQuery.'+key+'.value');
    },
    set: function(key, value){
      var filter = get(this, 'filter');
      var key = get(this, 'key');
      var options = get(this, 'options');
      return set(filter, 'normalizedQuery.'+key+'.value', value);
    }
  }),
  contentMethod: function(key){
    return Ember.String.pluralize(Ember.String.camelize(key));
  },
  minDate: computed(function(){
    return new Date();
  }),
  actions: {
    filterChanged: function(){
      get(this, 'filter').set('queryModified', true);
    },
    selectValue: function(event){
      set(this, 'value', event.target.value);
      get(this, 'filter').set('queryModified', true);
    }
  }
});
