'use strict';

angular
  .module('korbjagdApp')
  .factory('Photo', function($resource, ENV) {
    return $resource(ENV.api + '/baskets/:basketId/photo', {}, {
      update: {method: 'PATCH'}
    });
  });
