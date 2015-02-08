(function() {
  var restify;

  restify = require('restify');

  exports.register = function(server) {
    var directory, serve;
    directory = './dist/control';
    serve = restify.serveStatic({
      directory: directory
    });
    server.get(/^(?!\/?[api|client])\/?$/, function(req, res, next) {
      var newReq;
      newReq = {
        path: function() {
          return 'index.html';
        },
        method: 'GET',
        acceptsEncoding: req.acceptsEncoding
      };
      return serve(newReq, res, next);
    });
    return server.get(/^(?!\/?[api|client])\/?.*$/, serve);
  };

}).call(this);
