'use strict';

angular
  .module('korbjagdApp')
  .factory('Interceptor', function(Auth) {
    return {
      request: function(config) {
        var token = Auth.getToken();

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }
    };
  });
