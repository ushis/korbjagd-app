'use strict';

angular
  .module('korbjagdApp')
  .factory('DeleteToken', function($resource, ENV) {
    return $resource(ENV.api + '/profile/delete_token');
  });
