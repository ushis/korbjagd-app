'use strict';

angular
  .module('korbjagdApp')
  .controller('AppCtrl', function($scope, $rootScope, $timeout, $document, $state,
                                  _, Profile, Auth) {

    $scope.currentUser = null;
    $scope.appClass = '';

    // Returns the current user, if the user is signed in
    $scope.getCurrentUser = function() {
      return $scope.currentUser;
    };

    // Sets the current user
    $scope.setCurrentUser = function(user) {
      $timeout(function() {
        $scope.$apply(function() {
          $scope.currentUser = user;
        });
      });
    };

    // Checks if the passwd user is the current user
    $scope.isCurrentUser = function(user) {
      if ($scope.currentUser && user) {
        return $scope.currentUser.id === user.id;
      }
      return false;
    };

    // Destroys the auth token and unsets the current user
    $scope.signOut = function() {
      Auth.destroyToken();
      $scope.setCurrentUser(null);
      $state.go('map.app.home');
    };

    // Sets the document title
    $scope.setTitle = function() {
      $document[0].title = _.toArray(arguments).concat(['Korbjagd']).join(' - ');
    };

    // Generates the CSS state class
    var updateStateClass = function(state) {
      var names = state.name.split('.');
      names.splice(0, 2, 'state');
      $scope.appClass = names.join('-');
    };

    $rootScope.$on('$stateChangeSuccess', function(_, newState) {
      updateStateClass(newState);
    });

    updateStateClass($state.current);

    // Retrieve the users profile
    if (Auth.isSignedIn()) {
      Profile.get(function(resp) {
        $scope.setCurrentUser(resp.user);
      });
    }
  });
