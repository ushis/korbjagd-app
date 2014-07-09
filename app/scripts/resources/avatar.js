'use strict';

angular
  .module('korbjagdApp')
  .factory('Avatar', function($resource, ENV) {
    return $resource(ENV.api + '/profile/avatar', {}, {
      update: {method: 'PATCH'}
    });
  });
