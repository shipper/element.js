(function() {
  var ElementRevisionResource, ObjectId, Q, TypeRevisionResource, authenticate, _;

  authenticate = require('../../../authentication');

  Q = require('q');

  _ = require('lodash');

  TypeRevisionResource = require('../../../revision-resource/type');

  ElementRevisionResource = require('../../../revision-resource/element');

  ObjectId = require('mongoose').Types.ObjectId;

  exports.register = function(server) {
    server.get("/api/type/:type/element/:element", authenticate, exports.get);
    return server.get("/api/type/:type/element", authenticate, exports.getAll);
  };

  exports.getAll = function(req, res) {
    return TypeRevisionResource.findRevision(req.params.type, req.params.type_revision, req.user.organization_id, 'key', req.params.library).then(function(type) {
      var callback, deferred, options;
      deferred = Q.defer();
      callback = function(err, docs) {
        var keys;
        if (err) {
          return deferred.reject(err);
        }
        keys = [];
        _.each(docs, function(doc) {
          var id;
          id = doc.revision_map_id.toString();
          if (keys.indexOf(id) !== -1) {
            return;
          }
          return keys.push(id);
        });
        return deferred.resolve(keys);
      };
      options = {
        type_revision_map_id: type.revision_map_id,
        organization_id: req.user.organization_id
      };
      if (req.params.library != null) {
        options.library = req.params.library;
      }
      ElementRevisionResource.model.find(options, 'revision_map_id').exec(callback);
      return deferred.promise;
    }).then(function(keys) {
      var docs, promises;
      docs = [];
      promises = _.map(keys, function(key) {
        return ElementRevisionResource.findRevision(key, void 0, req.user.organization_id, 'id', req.params.library).then(function(doc) {
          return docs.push(doc);
        }).fail(function(err) {
          console.log(err);
          return true;
        });
      });
      return Q.all(promises).then(function() {
        return docs;
      });
    }).then(function(docs) {
      var elements;
      elements = [];
      _.each(docs, function(doc) {
        var data, json, _ref;
        data = (_ref = doc.data.data) != null ? _ref.toString() : void 0;
        try {
          json = JSON.parse(data);
        } catch (_error) {
          return;
        }
        return elements.push({
          key: doc.revision_map_key,
          revision: doc.revision || 0,
          create_date: doc.create_date,
          update_date: doc.update_date,
          data: json
        });
      });
      return res.send(200, elements);
    }).fail(function(err) {
      console.log(err, err.stack);
      return res.send(500, err);
    });
  };

  exports.get = function(req, res) {
    return TypeRevisionResource.findRevision(req.params.type, req.params.type_revision, req.user.organization_id).then(function(type) {
      return ElementRevisionResource.findRevision(req.params.element, req.params.element_revision, req.user.organization_id).then(function(element) {
        var data, json;
        if (element.type_revision_map_id !== type.revision_map_id) {
          return res.send(401, 'Unauthorized');
        }
        if (element.data.content_type !== 'application/json') {
          return res.send(400, 'Bad Request');
        }
        data = element.data.data.toString();
        json = JSON.parse(data);
        return res.send(200, json);
      });
    }).fail(function(err) {
      return res.send(500, err);
    });
  };

  exports.put = function(req, res) {};

  exports.post = function(req, res) {};

  exports.del = function(req, res) {};

  exports.find = function(req, res) {};

}).call(this);
