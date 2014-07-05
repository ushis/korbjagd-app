'use strict';

angular
  .module('korbjagdApp')
  .factory('Profile', function($resource, ENV) {
    return $resource(ENV.api + '/profile', {}, {
      update: {method: 'PATCH'},
    });
  });

