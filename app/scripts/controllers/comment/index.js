'use strict';

angular
  .module('korbjagdApp')
  .controller('CommentsCtrl', function($scope, comments, Comment) {
    $scope.setTitle('Comments', $scope.basket.name);
    $scope.comments = comments.comments;
    $scope.basket.comments_count = $scope.comments.length;
    $scope.comment = {comment: null};

    var editFormId = null;
    var commentBackup = null;

    var restoreComment = function() {
      if (!commentBackup) {
        return;
      }

      $scope.comments.forEach(function(comment) {
        if (comment.id === commentBackup.id) {
          angular.extend(comment, commentBackup);
        }
      });
    };

    $scope.showEditForm = function(comment) {
      return editFormId === comment.id;
    }

    $scope.edit = function(comment) {
      restoreComment();
      commentBackup = angular.copy(comment);
      editFormId = comment ? comment.id : null;
    };

    $scope.update = function(comment) {
      var data = {comment: angular.copy(comment)};
      var params = {basketId: $scope.basket.id, commentId: comment.id};

      Comment.update(params, data, function(resp) {
        commentBackup = null;
        $scope.edit(null);
      });
    };

    $scope.create = function() {
      var data = {comment: angular.copy($scope.comment)};

      Comment.save({basketId: $scope.basket.id}, data, function(resp) {
        $scope.comments.push(resp.comment);
        $scope.basket.comments_count = $scope.comments.length;
        $scope.comment = {comment: null};
      });
    };
  });
