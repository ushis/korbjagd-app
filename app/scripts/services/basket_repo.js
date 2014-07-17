'use strict';

angular
  .module('korbjagdApp')
  .factory('BasketRepo', function(_, $q, Basket) {

    // Pair of latitude, longitude representing a point
    var Point = function(latitude, longitude) {
      if (_.isPlainObject(latitude)) {
        this.latitude = latitude.latitude;
        this.longitude = latitude.longitude;
      } else if (_.isArray(latitude)) {
        this.latitude = latitude[0];
        this.longitude = latitude[1];
      } else if (_.isFunction(latitude.lat)) {
        this.latitude = latitude.lat();
        this.longitude = latitude.lng();
      } else {
        this.latitude = latitude;
        this.longitude = longitude;
      }
    };

    // Alias for latitude
    Point.prototype.lat = function() {
      return this.latitude;
    };

    // Alias for longitude
    Point.prototype.lng = function() {
      return this.longitude;
    };

    // Represents an area identified by id
    var Sector = function(id) {
      this.id = id;
    };

    // Length of one side of the sector square
    Sector.SIZE = 6;

    // Most south west point possible
    Sector.SOUTH_WEST = new Point(-90.0, -180.0);

    // Most north east point possible
    Sector.NORTH_EAST = new Point(90.0, 180.0);

    // Number of sectors per column
    Sector.ROWS = (Sector.NORTH_EAST.lat() - Sector.SOUTH_WEST.lat()) / Sector.SIZE;

    // Numbe rof sectors per row
    Sector.around = function() {
      var xmin, xmax, ymin, ymax, x = [], y = [], sectors = [];

      _.toArray(arguments).forEach(function(pnt) {
        x.push(Math.floor((pnt.lng() - Sector.SOUTH_WEST.lng()) / Sector.SIZE));
        y.push(Math.floor((pnt.lat() - Sector.SOUTH_WEST.lat()) / Sector.SIZE));
      });

      xmin = _.min(x);
      xmax = _.max(x);
      ymin = _.min(y);
      ymax = _.max(y);

      for (x = xmin; x <= xmax; x++) {
        for (y = ymin; y <= ymax; y++) {
          sectors.push(new Sector((x * Sector.ROWS) + y));
        }
      }
      return sectors;
    };

    // Represents the basket repository
    var Repo = function() {
      this.baskets = {};
      this.sectors = {};
    };

    // Puts a basket into the repo
    Repo.prototype.set = function(basket) {
      this.baskets[basket.id] = basket;
    };

    // Removes a basket from the repo
    Repo.prototype.rm = function(basket) {
      delete(this.baskets[basket.id]);
    };

    // Returns all nearby baskets
    Repo.prototype.nearby = function(latitude, longitude) {
      var sector = Sector.around(new Point(latitude, longitude))[0];
      var deferred = $q.defer();

      this.query(sector)
        .then(function(resp) {
          var baskets =  _.filter(resp.baskets, function(basket) {
            var a = basket.latitude - latitude;
            var b = basket.longitude - longitude;
            var c = 0.00045; // ~ 50 meters

            return Math.pow(a, 2) + Math.pow(b, 2) < Math.pow(c, 2);
          });

          deferred.resolve({baskets: baskets});
        })
        .catch(function(rejection) {
          deferred.reject(rejection);
        });

      return deferred.promise;
    };

    // Returns all baskets in the repo
    Repo.prototype.getAll = function() {
      return _.toArray(this.baskets);
    };

    // Asks the server for baskets in a sector
    Repo.prototype.query = function(sector) {
      this.sectors[sector.id] = true;

      var that = this;
      var deferred = $q.defer();

      Basket.query({sectorId: sector.id}).$promise
        .then(function(resp) {
          resp.baskets.forEach(function(basket) { that.set(basket); });
          deferred.resolve(resp);
        })
        .catch(function(rejection) {
          that.sectors[sector.id] = false;
          deferred.reject(rejection);
        });

      return deferred.promise;
    };

    // Asks the server for baskets in multiple sectors
    Repo.prototype.queryAll = function(sectors, callback) {
      var that = this;

      sectors.forEach(function(sector) {
        that.query(sector).then(function() {
          callback(that.getAll());
        });
      });
    };

    // Retrieves all baskets in the specified bounds
    // Queries the server if necessary
    Repo.prototype.get = function(sw, ne, callback) {
      var sectors = Sector.around(new Point(sw), new Point(ne))
        .filter(function(sector) {
          return !this.sectors[sector.id];
        }, this);

      if (sectors.length === 0) {
        callback(this.getAll());
      } else {
        this.queryAll(sectors, callback);
      }
    };

    return new Repo();
  });
