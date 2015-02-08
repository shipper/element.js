(function() {
  var Element, Q, Type, WritableStreamBuffer, get;

  Element = require('../../data/element');

  Q = require('q');

  WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

  get = require('./get');

  Type = require('../../data/type');

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
    return deferred.promise;
  };

  exports.publish = function(req, res) {
    return get.getElement(req.user, req.params.key, req.params.revision).then(function(element) {});
  };

  exports.put = function(req, res) {
    var promises, values;
    values = {
      data: null,
      revision: 0,
      base_id: null
    };
    promises = [];
    promises.push(exports.requestToData(req).then(function(data) {
      return values.data = data;
    }));
    promises.push(get.getRevisionsArray(req.user.organization_id, req.params.key).then(function(revisions) {
      var last;
      last = revisions[revisions.length - 1];
      if (last == null) {
        return;
      }
      values.base_id = last.base_id;
      return values.revision = last.revision + 1;
    }));
    return Q.all(promises).then(function() {
      var element;
      values.element = element = new Element({
        organization_id: req.user.organization_id,
        key: req.params.key,
        revision: values.revision,
        data: values.data
      });
      element.base_id = values.base_id || element.id;
      return element.savePromise();
    }).then(function() {
      if (values.revision === 0) {
        return res.send(203);
      }
      return res.send(204);
    }).fail(function(error) {
      return res.send(503, error);
    });
  };

}).call(this);
