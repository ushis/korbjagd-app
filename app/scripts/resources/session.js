'use strict';

angular
  .module('korbjagdApp')
  .factory('Session', function($resource, ENV) {
    return $resource(ENV.api + '/sessions');
  });

