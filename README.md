# Ember-filter

WillFilter addon for ember with data. Its provides the filter method on store to fetch the from server.


## Installation

* ember install ember-filter

## Example

If you need to filter the People, lets define the filter as PeopleFilter with filterOptions as shown bellow

```js
#PeopleFilter.js

#This can be fetched from server as async or constant.  For each FilterOption you can define custom `componentTemplate`
# For each filter option we can define visible to force show even if there are no values.
# TO show all filter options we can use allFIlterOptions-tru while rendering ember-filter-form
# to have custome element component, which will get filter as filter, options as filterOptions an key as FilterOptionKey(status)
filterOptions: computed(function(){
  return {
    status: { operator: 'is_in', type: 'selectize', label: 'People Status', visible: true },
    dropdown: { operator: 'is', type: 'dropdown', label: 'Custom dropdown', choices: computed(function(){
      return [
          { id: 1, name: "Choice one"},
          { id: 2, name: "Choice two"},
          { id: 3, name: "Choice three"},
      ]
    }) },
  }
}),

#You can define statuses which can be fetched from server.

Statuses: computed(function(){
  return get(this, 'store').peekAll('people-status');
})
```

## Configuration

Ember Filter is configured via the `'ember-filter'` section in the
application's `config/environment.js` file, e.g.:

```js
ENV['ember-filter'] = {
  filterModelEndsWith: '-filter'
};
```


## TODOs

* Test cases
* Pagination
* Searchable filter elements
* ~~Show filter elements when there is value associated~~.
* Support more options for form filters
