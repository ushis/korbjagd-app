'use strict';

angular
  .module('korbjagdApp')
  .factory('Auth', function($q, $window) {
    return {
      getToken: function() {
        var token = $window.localStorage.authToken;

        if (!this.isValidToken(token)) {
          return null;
        }
        return token;
      },
      setToken: function(token) {
        if (!this.isValidToken(token)) {
          return false;
        }
        $window.localStorage.authToken = token;
        return true;
      },
      destroyToken: function() {
        $window.localStorage.authToken = null;
      },
      isValidToken: function(token) {
        var claims;

        try {
          claims = JSON.parse(atob(token.split('.')[1]));
        } catch (_) {
          return false;
        }

        if (claims.exp * 1e3 < Date.now()) {
          return false;
        }
        return true;
      },
      isSignedIn: function() {
        return !!this.getToken();
      }
    };
  });
