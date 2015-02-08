(function() {
  var ElementInstance, Q, mongoose, restify, routes;

  restify = require('restify');

  Q = require('q');

  mongoose = require('./mongoose');

  routes = require('./routes');

  ElementInstance = (function() {
    function ElementInstance(options) {
      this.mongoose = mongoose;
      this.port = (options != null ? options.port : void 0) || 4000;
      this.client = restify.createServer({
        name: 'element-instance',
        acceptable: ['application/json', 'text/html']
      });
      this.client.use(restify.acceptParser(this.client.acceptable));
      this.client.use(restify.dateParser());
      this.client.use(restify.queryParser());
      this.client.use(restify.jsonp());
      this.client.use(restify.gzipResponse());
      this.client.use(restify.bodyParser({
        mapParams: false
      }));
      this._bind();
      this._registerRoutes();
    }

    ElementInstance.prototype._bind = function() {
      var key, val, _ref, _results;
      _ref = this.client;
      _results = [];
      for (key in _ref) {
        val = _ref[key];
        if (!(val instanceof Function)) {
          continue;
        }
        if (this.hasOwnProperty(key)) {
          continue;
        }
        _results.push(this[key] = val.bind(this.client));
      }
      return _results;
    };

    ElementInstance.prototype._registerRoutes = function() {
      return routes.register(this);
    };

    ElementInstance.prototype.start = function() {
      var deferred;
      deferred = Q.defer();
      this.client.listen(this.port, (function(_this) {
        return function() {
          return deferred.resolve(_this);
        };
      })(this));
      return deferred.promise;
    };

    return ElementInstance;

  })();

  module.exports = ElementInstance;

}).call(this);
