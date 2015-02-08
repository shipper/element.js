(function() {
  var Element, ElementResource, Q, Resource, authentication, del, get, lodash, post, put;

  authentication = require('../../authentication');

  Element = require('../../data/element');

  lodash = require('lodash');

  Resource = require('../../data/resource');

  Q = require('q');

  get = require('./get');

  del = require('./del');

  post = require('./post');

  put = require('./put');

  ElementResource = new Resource(Element, 'data', 'key');

  exports.register = function(server) {
    var killChain;
    server.get('/api/element', authentication, get.getAll);
    server.put('/api/element/:key/publish', authentication, put.publish);
    server.put('/api/element/:key/revisions/:revision/publish', authentication, put.publish);
    server.del('/api/element/:key', authentication, del.del);
    server.get('/api/element/:key', authentication, get.get);
    server.get('/api/element/:key/metadata', authentication, get.getMetadata);
    server.get('/api/element/:key/revisions/:revision', authentication, get.get);
    server.get('/api/element/:key/revisions', authentication, get.getRevisions);
    killChain = function(method, path, handler) {
      var route;
      route = server[method](path, function() {});
      return server.routes[route] = [authentication, handler];
    };
    killChain('post', '/api/element', post.post);
    return killChain('put', '/api/element/:key', put.put);
  };

}).call(this);
