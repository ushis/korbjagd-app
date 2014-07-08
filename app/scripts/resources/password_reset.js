'use strict';

angular
  .module('korbjagdApp')
  .factory('PasswordReset', function($resource, ENV) {
    return $resource(ENV.api + '/password_reset', {}, {
      update: {method: 'PATCH'}
    });
  });
