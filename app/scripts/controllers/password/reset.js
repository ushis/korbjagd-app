'use strict';

angular
  .module('korbjagdApp')
  .controller('PasswordResetCtrl', function($scope, $state, $stateParams,
                                            Profile, Auth) {

    $scope.showWarning = false;
    Auth.setToken($stateParams.token);

    Profile.get().$promise
      .then(function(resp) {
        $scope.setCurrentUser(resp.user);
        $state.go('map.app.profile');
      })
      .catch(function() {
        $scope.showWarning = true;
      });
  })
