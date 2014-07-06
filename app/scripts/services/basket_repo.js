'use strict';

angular
  .module('korbjagdApp')
  .factory('BasketRepo', function(_, Basket) {

    // Pair of latitude, longitude representing a point
    var Point = function(latitude, longitude) {
      if (_.isPlainObject(latitude)) {
        this.latitude = latitude.latitude;
        this.longitude = latitude.longitude;
      } else if (_.isArray(latitude)) {
        this.latitude = latitude[0];
        this.longitude = latitude[1];
      } else {
        this.latitude = latitude;
        this.longitude = longitude;
      }

      // 0.00001 ~ 1.1m
      this.latitude = Math.round(this.latitude * 100000) / 100000;
      this.longitude = Math.round(this.longitude * 100000) / 100000;
    };

    // Builds a new identical point
    Point.prototype.dup = function() {
      return new Point(this.latitude, this.longitude);
    };

    // Return the (latitude, longitude) pair as API friendly string
    Point.prototype.toString = function() {
      return [this.latitude, this.longitude].join(',');
    };

    // Pair of two points building a rectangle
    var Bounds = function(points) {
      this.southWest = null;
      this.northEast = null;

      _.toArray(points).forEach(function(point) {
        this.extend(point);
      }, this);
    };

    // Extends the rectangle so, that the given point lies inside
    Bounds.prototype.extend = function(point) {
      if (point) {
        this.extendSouthWest(point);
        this.extendNorthEast(point);
      }
    };

    // Extends the south east point if necessary
    Bounds.prototype.extendSouthWest = function(point) {
      if (this.southWest === null) {
        this.southWest = point.dup();
        return;
      }

      if (this.southWest.latitude > point.latitude) {
        this.southWest.latitude = point.latitude;
      }

      if (this.southWest.longitude > point.longitude) {
        this.southWest.longitude = point.longitude;
      }
    };

    // Extends the north west point if necessary
    Bounds.prototype.extendNorthEast = function(point) {
      if (this.northEast === null) {
        this.northEast = point.dup();
        return;
      }

      if (this.northEast.latitude < point.latitude) {
        this.northEast.latitude = point.latitude;
      }

      if (this.northEast.longitude < point.longitude) {
        this.northEast.longitude = point.longitude;
      }
    };

    // Returns the south bound
    Bounds.prototype.south = function() {
      return (this.southWest === null) ? null : this.southWest.latitude;
    };

    // Returns the west bound
    Bounds.prototype.west = function() {
      return (this.southWest === null) ? null : this.southWest.longitude;
    };

    // Returns the north bound
    Bounds.prototype.north = function() {
      return (this.northEast === null) ? null : this.northEast.latitude;
    };

    // Returns the east bound
    Bounds.prototype.east = function() {
      return (this.northEast === null) ? null : this.northEast.longitude;
    };

    // Returns the area of the rectangle
    Bounds.prototype.area = function() {
      return (this.north() - this.south()) * (this.east() - this.west());
    };

    // Returns the bounds as API friendly array
    Bounds.prototype.toParams = function() {
      return [this.southWest.toString(), this.northEast.toString()];
    };

    // Returns true if the rectangle equals another
    Bounds.prototype.equal = function(other) {
      return this.south() === other.south() &&
             this.west() === other.west() &&
             this.north() === other.north() &&
             this.east() === other.east();
    };

    // Represents the basket repository
    var Repo = function() {
      this.baskets = {};
      this.bounds = new Bounds();
    };

    // Puts a basket into the repo
    Repo.prototype.set = function(basket) {
      this.baskets[basket.id] = basket;
    };

    // Removes a basket from the repo
    Repo.prototype.rm = function(basket) {
      delete(this.baskets[basket.id]);
    };

    // Returns all baskets in the repo
    Repo.prototype.getAll = function() {
      return _.toArray(this.baskets);
    };

    // Queries the server for baskets in the specified bounds
    Repo.prototype.query = function(bounds, callback) {
      var that = this;
      var params = {'inside[]': bounds.toParams()};

      if (this.bounds.area() > 0) {
        params['outside[]'] = this.bounds.toParams();
      }

      Basket.query(params, function(resp) {
        resp.baskets.forEach(function(basket) {
          that.set(basket);
        }, that);

        var bounds = resp.params.inside;
        that.bounds.extend(new Point(bounds.south_west));
        that.bounds.extend(new Point(bounds.north_east));
        callback(that.getAll());
      });
    };

    // Retrieves all baskets in the specified bounds
    // Queries the server if necessary
    Repo.prototype.get = function(points, callback) {
      var bounds = new Bounds(points.map(function(point) {
        return new Point(point);
      }));

      bounds.extend(this.bounds.southWest);
      bounds.extend(this.bounds.northEast);

      if (bounds.equal(this.bounds)) {
        callback(this.getAll());
      } else {
        this.query(bounds, callback);
      }
    };

    return new Repo();
  });
