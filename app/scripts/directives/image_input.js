'use strict';

angular
  .module('korbjagdApp')
  .directive('imageInput', function($window, $document) {

    // Creates an image from a file
    var mkImg = function(file, callback) {
      var img = new $window.Image();

      img.addEventListener('load', function() {
        callback(img);
      });

      img.src = $window.URL.createObjectURL(file);
    };

    // Creates a canvas
    var mkCanvas = function(width, height) {
      var cvs = $document[0].createElement('canvas');
      cvs.width = width;
      cvs.height = height;
      return cvs;
    };

    // Resize image to fit into the given bounds
    var fitImg = function(img, maxWidth, maxHeight) {
      var width = img.width;
      var height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (maxHeight * width) / height;
        height = maxHeight;
      }

      var cvs = mkCanvas(width, height);
      var ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      return cvs;
    };

    // Resize image the fill the given bounds
    var fillImg = function(img, maxWidth, maxHeight) {
      var width = img.width;
      var height = img.height;

      if (maxWidth / maxHeight > width / height) {
        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (maxHeight * width) / height;
          height = maxHeight;
        }
      }

      var cvs = mkCanvas(maxWidth, maxHeight);
      var ctx = cvs.getContext('2d');
      var x = (maxWidth - width) / 2;
      var y = (maxHeight - height) / 2;
      ctx.drawImage(img, x, y, width, height);
      return cvs;
    };

    // Resizes an image
    var resizeImg = function(img, opts) {
      if (opts.process === 'fill') {
        return fillImg(img, opts.width, opts.height);
      }
      return fitImg(img, opts.width, opts.height);
    };

    return {
      restrict: 'E',
      scope: {
        model: '=',
        process: '@',
        maxWidth: '@',
        maxHeight: '@'
      },
      template: '<input accept="image/*" type="file">',
      link: function(scope, element) {

        // Options
        var opts = {
          process: scope.process || 'fit',
          width: parseInt(scope.maxWidth) || 600,
          height: parseInt(scope.maxHeight) || 600
        };

        // Watch input field for new files
        element.find('input').bind('change', function(e) {
          if (e.target.files.length > 0) {
            var file = e.target.files[0];

            mkImg(file, function(img) {
              scope.$apply(function() {
                scope.model.url = resizeImg(img, opts).toDataURL();
                scope.model.name = file.name;
              });
            });
          }
        });
      }
    };
  });
