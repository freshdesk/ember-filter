import { camelize } from '@ember/string';
import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import Ember from 'ember';
import layout from '../templates/components/ember-filter-form-element';

export default Component.extend({
  layout: layout,
  classNames: ['filter-form-field'],

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
    get(){
      var filter = get(this, 'filter');
      var key = get(this, 'key');
      return get(filter, 'normalizedQuery.'+key+'.value');
    },
    set(key, value){
      var filter = get(this, 'filter');
      var queryKey = get(this, 'key');
      return set(filter, 'normalizedQuery.'+queryKey+'.value', value);
    }
  }),
  contentMethod: function(key){
    return Ember.String.pluralize(camelize(key));
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
