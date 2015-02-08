(function() {
  var Q, Resource,
    __hasProp = {}.hasOwnProperty;

  Q = require('q');

  Resource = (function() {
    function Resource(_at_type, _at_data_key, _at_key) {
      this.type = _at_type;
      this.data_key = _at_data_key != null ? _at_data_key : null;
      this.key = _at_key != null ? _at_key : 'uuid';
    }

    Resource.prototype.httpPut = function(req, res) {
      var promise;
      promise = this._put(req.user, req.body, req.params.key);
      return this._res(promise, res);
    };

    Resource.prototype.httpPost = function(req, res) {
      return put(req, res);
    };

    Resource.prototype.httpGet = function(req, res) {
      var promise;
      promise = this._del(req.user, req.params.key);
      return this._res(promise, res);
    };

    Resource.prototype.httpDel = function(req, res) {
      var promise;
      promise = this._del(req.user, req.params.key);
      return this._res(promise, res);
    };

    Resource.prototype._res = function(promise, res) {
      return promise.then(function(result) {
        return res.send(result.status, result.body);
      });
    };

    Resource.prototype._assign = function(instance, values) {
      var key, val, _results;
      if (this.data_key != null) {
        instance[this.data_key] = values;
        return;
      }
      _results = [];
      for (key in values) {
        if (!__hasProp.call(values, key)) continue;
        val = values[key];
        _results.push(instance[key] = val);
      }
      return _results;
    };

    Resource.prototype.get = function(agent, key) {
      var callback, deferred, options;
      if (typeof uuid === "undefined" || uuid === null) {
        return Q.resolve({
          success: false,
          status: 404
        });
      }
      deferred = Q.defer();
      options = {};
      options[this.key] = key;
      callback = function(err, data) {
        if (err || data.length === 0) {
          return deferred.reject(err || 'Not Found');
        }
        return deferred.resolve(data[0]);
      };
      this.Type.find(options, callback);
      return deferred.promise.then((function(_this) {
        return function(doc) {
          var data;
          if ((doc.organization_id != null) && doc.organization_id !== (agent != null ? agent.organization_id : void 0)) {
            return Q.resolve({
              success: false,
              status: 401
            });
          }
          data = doc;
          if (_this.data_key) {
            data = doc != null ? doc[_this.data_key] : void 0;
          }
          return {
            success: true,
            status: 200,
            body: data,
            document: doc,
            key: doc.uuid
          };
        };
      })(this)).fail(function() {
        return {
          success: false,
          status: 404,
          key: key
        };
      });
    };

    Resource.prototype.del = function(agent, key) {
      return this.get(agent, key).then(function(result) {
        var document;
        document = result.document;
        return document.removePromise();
      }).then(function() {
        return {
          success: true,
          status: 200
        };
      }).fail(function() {
        return {
          success: false,
          status: 404,
          key: key
        };
      });
    };

    Resource.prototype.put = function(agent, data, key) {
      return this.get(agent, key).fail((function(_this) {
        return function() {
          var document, type;
          type = _this.type;
          document = new type();
          if (document.organization_id != null) {
            document.organization_id = agent.organization_id;
          }
          return document;
        };
      })(this)).then((function(_this) {
        return function(document) {
          _this._assign(document, data);
          return document.savePromise();
        };
      })(this)).then((function(_this) {
        return function(document) {
          return {
            success: true,
            status: 200,
            body: _this.data_key != null ? document[_this.data_key] : document,
            key: document.uuid
          };
        };
      })(this)).fail(function() {
        return {
          success: false,
          status: 503
        };
      });
    };

    return Resource;

  })();

  module.exports = Resource;

}).call(this);
