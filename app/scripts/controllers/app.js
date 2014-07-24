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
        $scope.currentUser = user;
        $scope.$apply();
      });
    };

    // Checks if the passed user is the current user
    $scope.isCurrentUser = function(user) {
      var currentUser = $scope.getCurrentUser();
      return currentUser && user && currentUser.id === user.id;
    };

    // Returns true if the current user is an admin else false
    $scope.isAdmin = function() {
      var user = $scope.getCurrentUser();
      return user && user.admin === true;
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
      $scope.appClass = 'state-' + state.name.split('.').slice(2).join('-');
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
