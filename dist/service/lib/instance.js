(function() {
  var ElementInstance, Q, mongoose, restify, routes,
    __hasProp = {}.hasOwnProperty;

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
      this.client.use(this.elementInterceptor);
      this._bind();
      this._registerRoutes();
    }

    ElementInstance.prototype.elementInterceptor = function(req, res, next) {
      var checkKey, element, key, new_key, value, _ref, _ref1;
      element = {};
      checkKey = 'X-Element-';
      _ref = req.headers;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        value = _ref[key];
        if (key.substr(0, Math.min(key.length, checkKey.length)) !== checkKey) {
          continue;
        }
        new_key = key.substr(checkKey.length);
        element[new_key] = value;
      }
      req.element = element;
      req.library = element['Library'];
      if (req.library == null) {
        req.library = (_ref1 = req.params) != null ? _ref1.library : void 0;
      }
      return next();
    };

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
      this.routes = this.client.routes;
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
