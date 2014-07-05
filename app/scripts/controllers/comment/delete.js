'use strict';

angular
  .module('korbjagdApp')
  .controller('CommentDeleteCtrl', function($scope, $state, comment, Comment) {
    if (!$scope.isCurrentUser(comment.comment.user)) {
      $state.go('map.app.basket.comments', {basketId: $scope.basket.id});
    }
    $scope.setTitle('Delete Comment', $scope.basket.name);

    $scope.delete = function() {
      var params = {
        basketId: $scope.basket.id,
        commentId: comment.comment.id
      };

      Comment.delete(params, function() {
        $state.go('map.app.basket.comments', {basketId: $scope.basket.id});
      });
    };
  });
