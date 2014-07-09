'use strict';

angular
  .module('korbjagdApp')
  .factory('Interceptor', function($q, $injector, Auth, ENV) {

    // Returns true if the given url is a API url
    var isApiUrl = function(url) {
      return url && url.indexOf(ENV.api) === 0;
    };

    return {

      // Adds the Authorization header to API calls
      request: function(config) {
        if (!isApiUrl(config.url)) {
          return config;
        }
        var token = Auth.getToken();

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },

      // Handles request errors
      responseError: function(resp) {
        if ([403, 404, 500].indexOf(resp.status) > -1) {
          $injector.get('$state').go('map.app.error', {status: resp.status});
        }
        return $q.reject(resp);
      }
    };
  });
