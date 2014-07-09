'use strict';

angular
  .module('korbjagdApp')
  .controller('ErrorCtrl', function($scope, $stateParams) {
    var errors = {
      '403': {
        status: 403,
        error: 'Forbidden',
        message: 'You are not allowed to perform the request.',
        note: 'Access requirements can change sometimes.'
      },
      '404': {
        status: 404,
        error: 'Not Found',
        message: 'The page you are looking for does not exist.',
        note: 'Maybe the page was deleted or you followed an invalid link.'
      },
      '500': {
        status: 500,
        error: 'Internal Server Error',
        message: 'Sorry, we have problems handling your request.',
        note: 'This should not happen. It is our fault and we apologize. Please try it again later.'
      }
    };

    $scope.error = errors[$stateParams.status] || errors['404'];
    $scope.setTitle($scope.error.status, $scope.error.error);
  });
