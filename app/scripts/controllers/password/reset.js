'use strict';

angular
  .module('korbjagdApp')
  .controller('PasswordResetCtrl', function($scope, $state, $stateParams,
                                            $filter, PasswordReset, Auth) {

    $scope.showWarning = false;
    $scope.user = {password: null, password_confirmation: null};

    if (!Auth.setToken($stateParams.token)) {
      $scope.showWarning = true;
    }

    $scope.submit = function() {
      PasswordReset.update({user: $scope.user}).$promise
        .then(function() {
          Auth.destroyToken();
          $state.go('map.app.sign.in');
        })
        .catch(function(resp) {
          var titleize = $filter('titleize');
          $scope.errors = {};

          angular.forEach(resp.data.details, function(details, attr) {
            $scope.errors[attr] = [titleize(attr), details[0]].join(' ');
          });
        });
    };
  })
