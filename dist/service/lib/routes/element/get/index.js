(function() {
  var Element, Group, Q, Revision, _;

  Element = require('../../../data/element/index');

  Q = require('q');

  Revision = require('./revision');

  Group = require('./group');

  _ = require('lodash');

  exports.getElementDetails = function(agent) {
    var callback, deferred, options;
    deferred = Q.defer();
    callback = function(err, elements) {
      var base, result;
      if (err) {
        return deferred.reject(err);
      }
      base = {};
      _.each(elements, function(element) {
        var _name;
        return (base[_name = element.base_id.toString()] != null ? base[_name] : base[_name] = []).push(element);
      });
      result = [];
      _.each(_.keys(base), function(key) {
        var group;
        group = base[key];
        return result.push(new Group(group));
      });
      return deferred.resolve(result);
    };
    options = {
      organization_id: agent.organization_id
    };
    Element.find(options, callback);
    return deferred.promise;
  };

  exports.getElement = function(agent, key, revision) {
    var callback, deferred, options, r;
    if (revision == null) {
      revision = -1;
    }
    deferred = Q.defer();
    callback = function(err, elements) {
      var element, val, _i, _len;
      if (err || elements.length === 0) {
        return deferred.reject(err);
      }
      if (revision !== -1) {
        return deferred.resolve(elements[0]);
      }
      element = null;
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        val = elements[_i];
        if (element == null) {
          element = val;
          continue;
        }
        if (element.revision < val.revision) {
          element = val;
        }
      }
      return deferred.resolve(element);
    };
    options = {
      key: key,
      organization_id: agent.organization_id
    };
    if (revision !== -1) {
      r = parseInt(revision, 10);
      if (isNaN(r)) {
        options.uuid = revision;
      } else {
        options.revision = r;
      }
    }
    Element.find(options, callback);
    return deferred.promise;
  };

  exports.getRevisionsArray = function(organization_id, key) {
    var callback, deferred;
    deferred = Q.defer();
    callback = function(error, elements) {
      var base_id, revisions;
      if (error) {
        return deferred.reject(error);
      }
      if (elements.length === 0) {
        return deferred.resolve([]);
      }
      base_id = elements[0].base_id;
      error = false;
      revisions = _.map(elements, function(element) {
        if (element.base_id.toString() !== base_id.toString()) {
          error = true;
          return;
        }
        return new Revision(element);
      });
      if (error) {
        return deferred.reject('More then one base for this key');
      }
      revisions = revisions.sort(function(a, b) {
        return a.revision - b.revision;
      });
      return deferred.resolve(revisions);
    };
    Element.find({
      key: key,
      organization_id: organization_id
    }, 'revision create_date uuid base_id', callback);
    return deferred.promise;
  };

  exports.getRevisions = function(req, res) {
    return exports.getRevisionsArray(req.user.organization_id, req.params.key).then(function(array) {
      return res.send(200, array);
    }).fail(function(error) {
      return res.send(503, error);
    });
  };

  exports.getMetadata = function(req, res) {
    return exports.getElement(req.user, req.params.key, req.params.revision).then(function(result) {
      return res.send(200, {
        revision: result.element.revision,
        create_date: result.element.create_date,
        unique_key: result.element.uuid
      });
    }).fail(function() {
      return res.send(404);
    });
  };

  exports.getAll = function(req, res) {
    return exports.getElementDetails(req.user).then(function(result) {
      return res.send(200, result);
    }).fail(function(error) {
      return res.send(503, error);
    });
  };

  exports.get = function(req, res) {
    return exports.getElement(req.user, req.params.key, req.params.revision).then(function(element) {
      var data, publish_revision;
      data = element.data;
      publish_revision = element.publish_revision || 0;
      if (!element.published) {
        publish_revision = -1;
      }
      res.writeHead(200, {
        'X-Element-Revision': element.revision,
        'X-Element-Publish-Revision': publish_revision,
        'X-Element-Type': element.type_name,
        'X-Element-Type-Id': element.type_id || -1,
        'Content-Length': data.data.length,
        'Content-Type': data.content_type
      });
      res.write(data.data);
      return res.end();
    }).fail(function() {
      return res.send(404);
    });
  };

}).call(this);
