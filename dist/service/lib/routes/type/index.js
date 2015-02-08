(function() {
  var Q, RevisionResource, Schema, Type, TypeRevisionResource, authentication, element, uuid, _,
    __hasProp = {}.hasOwnProperty;

  Type = require('../../data/type');

  Schema = require('../../data/type/schema');

  authentication = require('../../authentication');

  uuid = require('node-uuid');

  Q = require('q');

  _ = require('lodash');

  element = require('./element');

  RevisionResource = require('../../revision-resource');

  TypeRevisionResource = new RevisionResource('Type', Schema);

  exports.register = function(server) {
    element.register(server);
    server.get('/api/type/base', exports.base);
    server.get('/api/type', authentication, exports.find);
    server.post('/api/type', authentication, exports.post);
    server.put('/api/type/:key', authentication, exports.put);
    server.get('/api/type/:key', authentication, exports.get);
    server.get('/api/type/:key/definition', authentication, exports.getDefinition);
    server.del('/api/type/:key', authentication, exports.del);
    server.get('/api/type/:key/revisions/:revision', authentication, exports.get);
    return server.get('/api/type/:key/revisions', authentication, exports.getRevisions);
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

  exports.post = function(req, res, next) {
    return exports.put(req, res, next);
  };

  exports.put = function(req, res) {
    var instance;
    instance = TypeRevisionResource.create();
    instance.organization_id = req.user.organization_id;
    instance.revision_map_key = req.params.key;
    instance.name = req.body.name;
    instance.description = req.body.description;
    instance.definition = req.body.definition;
    return TypeRevisionResource.save(instance).then(function(instance) {
      var status, _ref;
      if (((_ref = req.params) != null ? _ref.key : void 0) == null) {
        res.header("Location", "/api/type/" + instance.revision_map_key);
      }
      status = instance.$revision === 0 ? 201 : 204;
      return res.send(status);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.getRevisions = function(req, res) {
    return TypeRevisionResource.getRevisions(req.params.key, req.user.organization_id).then(function(revisions) {
      return res.send(200, revisions);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.get = function(req, res) {
    return TypeRevisionResource.findRevision(req.params.key, req.params.revision, req.user.organization_id).then(function(instance) {
      return res.send(200, instance);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.getDefinition = function(req, res) {
    return TypeRevisionResource.findRevision(req.params.key, req.params.revision, req.user.organization_id).then(function(instance) {
      return instance.getDefinition().then(function(definition) {
        return res.send(200, definition);
      }).fail(function(error) {
        return res.send(500, error);
      });
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.del = function(req, res) {};

  exports.find = function(req, res) {
    return TypeRevisionResource.getAll(req.user.organization_id, false).then(function(documents) {
      return res.send(200, documents);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

}).call(this);
