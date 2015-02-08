(function() {
  var Q, Type, authentication, uuid, _,
    __hasProp = {}.hasOwnProperty;

  Type = require('../../data/type');

  authentication = require('../../authentication');

  uuid = require('node-uuid');

  Q = require('q');

  _ = require('lodash');

  exports.register = function(server) {
    server.get('/api/type/base', exports.base);
    server.get('/api/type', authentication, exports.find);
    server.post('/api/type', authentication, exports.post);
    server.put('/api/type/:key', authentication, exports.put);
    server.get('/api/type/:key', authentication, exports.get);
    server.get('/api/type/:key/definition', authentication, exports.getDefinition);
    return server.del('/api/type/:key', authentication, exports.del);
  };

  exports.base = function(req, res) {
    var base, key, val, _ref;
    base = {};
    _ref = Type.Base;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      val = _ref[key];
      if (val.disabled) {
        continue;
      }
      base[key] = val;
    }
    return res.send(200, base);
  };

  exports.post = function(req, res) {
    var type;
    type = new Type(req.body);
    type.organization_id = req.user.organization_id;
    type.key = uuid.v4();
    return type.save(function(err, type) {
      if (err) {
        return res.send(500, err);
      }
      res.header("Location", "/api/type/" + type.key);
      return res.send(201);
    });
  };

  exports.put = function(req, res) {
    var deferred, isNew;
    deferred = Q.defer();
    isNew = false;
    Type.find({
      key: req.params.key,
      organization_id: req.user.organization_id
    }, function(err, types) {
      var type;
      if (!(err || types.length === 0)) {
        return deferred.resolve(types[0]);
      }
      isNew = true;
      type = new Type({
        key: req.params.key,
        organization_id: req.user.organization_id
      });
      deferred.resolve(type);
    });
    return deferred.promise.then(function(type) {
      type.name = req.body.name;
      type.description = req.body.description;
      type.definition = req.body.definition;
      deferred = Q.defer();
      type.save(function(err) {
        if (err) {
          return deferred.resolve(err);
        }
        return deferred.resolve(type);
      });
      return deferred.promise;
    }).then(function() {
      return res.send(isNew ? 203 : 204);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.get = function(req, res) {
    return Type.find({
      key: req.params.key,
      organization_id: req.user.organization_id
    }, function(err, type) {
      if (err || !(type != null ? type.length : void 0)) {
        return res.send(404);
      }
      return res.send(200, {
        name: type[0].name,
        description: type[0].description,
        definition: type[0].definition
      });
    });
  };

  exports.getDefinition = function(req, res) {
    return Type.find({
      key: req.params.key,
      organization_id: req.user.organization_id
    }, function(err, type) {
      if (err || !(type != null ? type.length : void 0)) {
        return res.send(404);
      }
      return type[0].getDefinition().then(function(definition) {
        return res.send(200, definition);
      }).fail(function(error) {
        return res.send(500, error);
      });
    });
  };

  exports.del = function(req, res) {};

  exports.find = function(req, res) {
    var query;
    query = Type.find({
      organization_id: req.user.organization_id
    });
    return query.exec(function(err, types) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(200, _.map(types, function(type) {
        return {
          key: type.key,
          name: type.name,
          description: type.description,
          definition: type.definition
        };
      }));
    });
  };

}).call(this);
