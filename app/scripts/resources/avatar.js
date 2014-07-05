'use strict';

angular
  .module('korbjagdApp')
  .factory('Avatar', function($resource, ENV) {
    return $resource(ENV.api + '/users/:userId/avatar', {}, {
      update: {method: 'PATCH'}
    });
  });
