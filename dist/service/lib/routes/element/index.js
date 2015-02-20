(function() {
  var ElementRevisionResource, Q, Request, RevisionResource, Schema, TypeRevisionResource, WritableStreamBuffer, authentication, type;

  authentication = require('../../authentication');

  RevisionResource = require('../../revision-resource');

  Schema = require('../../data/element/schema');

  WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

  Q = require('q');

  type = require('../type');

  ElementRevisionResource = require('../../revision-resource/element');

  TypeRevisionResource = require('../../revision-resource/type');

  Request = require('request');

  exports.register = function(server) {
    var killChain;
    server.get('/api/element', authentication, exports.getAll);
    server.get('/api/library/:library/element', authentication, exports.getAll);
    server.get('/api/element/:key', authentication, exports.get);
    server.get('/api/element/:key/metadata', authentication, exports.getMetadata);
    server.get('/api/element/:key/revision/:revision', authentication, exports.get);
    server.get('/api/element/:key/revision/:revision/metadata', authentication, exports.getMetadata);
    server.get('/api/element/:key/revision', authentication, exports.getRevisions);
    server.get('/api/library/:library/element/:key', authentication, exports.get);
    server.get('/api/library/:library/element/:key/metadata', authentication, exports.getMetadata);
    server.get('/api/library/:library/element/:key/revision/:revision', authentication, exports.get);
    server.get('/api/library/:library/element/:key/revision/:revision/metadata', authentication, exports.getMetadata);
    server.get('/api/library/:library/element/:key/revision', authentication, exports.getRevisions);
    server.post('/api/library/:library/element/url/:url', authentication, exports.postURL);
    server.put('/api/library/:library/element/:key/url/:url', authentication, exports.putURL);
    server.post('/api/library/:library/element/url/:url', authentication, exports.postURL);
    server.put('/api/library/:library/element/:key/url/:url', authentication, exports.putURL);
    killChain = function(method, path, handler) {
      var route;
      route = server[method](path, function() {});
      return server.routes[route] = [authentication, server.elementInterceptor, handler];
    };
    killChain('post', '/api/library/:library/element', exports.post);
    killChain('put', '/api/library/:library/element/:key', exports.put);
    killChain('post', '/api/element', exports.post);
    return killChain('put', '/api/element/:key', exports.put);
  };

  exports.getAll = function(req, res) {
    return ElementRevisionResource.getAll(req.user.organization_id, true).then(function(documents) {
      return res.send(200, documents);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.getRevisions = function(req, res) {
    return ElementRevisionResource.getRevisions(req.params.key, req.user.organization_id).then(function(revisions) {
      return res.send(200, revisions);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.getMetadata = function(req, res) {
    return ElementRevisionResource.findRevision(req.params.key, req.params.revision, req.user.organization_id).then(function(element) {
      return res.send(200, {
        revision: element.revision,
        revision_key: element.revision_key,
        key: req.params.key,
        data_length: element.data.data.length,
        content_type: element.data.content_type,
        type_key: element.type_revision_map_key,
        type_revision: element.type_revision || 0
      });
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.get = function(req, res) {
    return ElementRevisionResource.findRevision(req.params.key, req.params.revision, req.user.organization_id).then(function(element) {
      var data, headers;
      data = element.data;
      headers = {
        'X-Element-Revision': element.revision,
        'X-Element-Publish-Revision': -1,
        'X-Element-Type-Key': element.type_revision_map_key,
        'X-Element-Type-Revision': element.type_revision || 0,
        'Content-Length': data.data.length,
        'Content-Type': data.content_type
      };
      Object.keys(headers).forEach(function(key) {
        return res.setHeader(key, headers[key]);
      });
      res.writeHead(200);
      res.write(data.data);
      return res.end();
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.put = function(req, res) {
    return exports.putData(exports.requestToData(req), req, res);
  };

  exports.putData = function(dataPromise, req, res) {
    var instance, promise, revision_num, _ref;
    instance = ElementRevisionResource.create();
    instance.organization_id = req.user.organization_id;
    instance.revision_map_key = (_ref = req.params) != null ? _ref.key : void 0;
    instance.type_key = req.header('X-Element-Type-Key');
    instance.type_revision = req.header('X-Element-Type-Revision');
    if (typeof instance.type_revision === 'string') {
      revision_num = parseInt(instance.type_revision, 10);
      if (!isNaN(revision_num)) {
        instance.type_revision = revision_num;
      }
    }
    promise = Q.resolve();
    if (instance.type_key != null) {
      promise = TypeRevisionResource.findRevision(instance.type_key, instance.type_revision, req.user.organization_id).then(function(type) {
        instance.type_id = type.type_id;
        instance.type_revision_map_id = type.revision_map_id;
        instance.type_revision = type.revision;
        return instance.type_revision_map_key = type.revision_map_key;
      });
    }
    return promise.then(function() {
      return dataPromise.then(function(data) {
        instance.data = data;
        return ElementRevisionResource.save(instance);
      }).then(function(instance) {
        var status, _ref1;
        if (((_ref1 = req.params) != null ? _ref1.key : void 0) == null) {
          res.header("Location", "/api/element/" + instance.revision_map_key);
        }
        status = instance.revision === 0 ? 201 : 204;
        return res.send(status);
      });
    }).fail(function(error) {
      console.log(error, error.stack);
      return res.send(500, error);
    });
  };

  exports.post = function(req, res, next) {
    return exports.put(req, res, next);
  };

  exports.requestToData = function(req) {
    var deferred, stream;
    deferred = Q.defer();
    stream = new WritableStreamBuffer();
    req.pipe(stream);
    req.on('end', function() {
      var contents;
      contents = stream.getContents() || new Buffer(0);
      return deferred.resolve({
        data: contents,
        content_type: req.getContentType()
      });
    });
    req.on('error', function(error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  };

  exports.postURL = function(req, res) {
    return exports.putURL(req, res);
  };

  exports.putURL = function(req, res) {
    var data_request, promise;
    data_request = Request(req.params.url);
    if (data_request.getContentType == null) {
      data_request.getContentType = function() {
        console.log(data_request);
        return data_request.response.headers['content-type'];
      };
    }
    promise = exports.requestToData(data_request);
    return exports.putData(promise, req, res);
  };

}).call(this);
