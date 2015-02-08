(function() {
  var Element, Q, WritableStreamBuffer, put;

  Element = require('../../data/element');

  Q = require('q');

  WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

  put = require('./put');

  exports.post = function(req, res) {
    return put.requestToData(req).then(function(data) {
      var element;
      element = new Element({
        organization_id: req.user.organization_id,
        data: data
      });
      element.base_id = element.id;
      return element.savePromise();
    }).then(function(element) {
      res.header("Location", "/api/element/" + element.key);
      return res.send(201);
    }).fail(function(error) {
      return res.send(503, error);
    });
  };

}).call(this);
