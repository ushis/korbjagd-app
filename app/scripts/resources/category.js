'use strict';

angular
  .module('korbjagdApp')
  .factory('Category', function($resource, ENV) {
    return $resource(ENV.api + '/categories/:categoryId', {
      categoryId: '@category.id'
    }, {
      query: {method: 'GET'}
    });
  });

