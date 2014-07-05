'use strict';

angular
  .module('korbjagdApp')
  .factory('User', function($resource, ENV) {
    return $resource(ENV.api + '/users/:userId', {
      userId: '@user.id'
    }, {
      update: {method: 'PATCH'},
      query: {method: 'GET'}
    });
  });

