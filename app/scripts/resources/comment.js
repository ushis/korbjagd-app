'use strict';

angular
  .module('korbjagdApp')
  .factory('Comment', function($resource, ENV) {
    return $resource(ENV.api + '/baskets/:basketId/comments/:commentId', {
      commentId: '@comment.id'
    }, {
      update: {method: 'PATCH'},
      query: {method: 'GET'}
    });
  });

