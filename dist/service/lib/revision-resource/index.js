(function() {
  var ExternalRevision, Q, Revision, RevisionArray, RevisionResources, mongoose, uuid, _;

  Q = require('q');

  mongoose = require('mongoose');

  Revision = require('./revision');

  RevisionArray = require('./revision-array');

  uuid = require('node-uuid');

  _ = require('lodash');

  ExternalRevision = require('./external-revision');

  RevisionResources = (function() {
    function RevisionResources(_at_name, _at_schema) {
      this.name = _at_name;
      this.schema = _at_schema;
      this.$__buildModels();
    }

    RevisionResources.prototype.$__buildModels = function() {
      if (this.schema.tree['revision_map_id'] == null) {
        throw new Error("Schema does not include 'revision_map_id'");
      }
      if (this.schema.tree['revision_map_key'] == null) {
        throw new Error("Schema does not include 'revision_map_key'");
      }
      if (this.schema.tree['revision'] == null) {
        throw new Error("Schema does not include 'revision'");
      }
      if (this.schema.tree['revision_key'] == null) {
        throw new Error("Schema does not include 'revision_key'");
      }
      if (this.schema.tree['organization_id'] == null) {
        throw new Error("Schema does not include 'organization_id'");
      }
      if (this.schema.tree['id'] == null) {
        throw new Error("Schema does not include 'id'");
      }
      this.model = mongoose.model(this.name, this.schema);
      return this.revisonModel = Revision.define(this.name);
    };

    RevisionResources.prototype.create = function() {
      return new this.model();
    };

    RevisionResources.prototype.find = function(key, org) {
      return this.findRevision(key, -1, org);
    };

    RevisionResources.prototype.findRevision = function(key, revision, org, key_type) {
      var deferred, findById_callback, revision_num;
      if (revision == null) {
        revision = -1;
      }
      if (key_type == null) {
        key_type = 'key';
      }
      if (typeof revision === 'string') {
        revision_num = parseInt(revision, 10);
        if (!isNaN(revision_num)) {
          revision = revision_num;
        }
      }
      deferred = Q.defer();
      findById_callback = function(err, document) {
        if (err) {
          return deferred.reject(err);
        }
        return deferred.resolve(document);
      };
      this.getRevisions(key, org, key_type).then((function(_this) {
        return function(revisions) {
          var revision_key, revision_obj, revision_possible, _i, _len;
          revision_obj = null;
          revision_key = typeof revision === 'string' ? 'key' : 'revision';
          for (_i = 0, _len = revisions.length; _i < _len; _i++) {
            revision_possible = revisions[_i];
            if (revision_key === 'revision' && revision === -1) {
              if (revision_obj == null) {
                revision_obj = revision_possible;
                continue;
              }
              if (!(revision_possible.revision > revision_possible)) {
                continue;
              }
              revision_obj = revision_possible;
              continue;
            } else if (revision_possible[revision_key] === revision) {
              revision_obj = revision_possible;
              break;
            }
          }
          if (revision_obj == null) {
            return deferred.reject('Not Found');
          }
          return _this.model.findById(revision_obj.external_id, findById_callback);
        };
      })(this)).fail(deferred.reject);
      return deferred.promise;
    };

    RevisionResources.prototype.getAll = function(org, reference) {
      var deferred, find_callback;
      if (reference == null) {
        reference = false;
      }
      deferred = Q.defer();
      find_callback = (function(_this) {
        return function(err, documents) {
          var latest, promises, revisions;
          if (err) {
            return deferred.reject(err);
          }
          documents = _.filter(documents, function(document) {
            return document.delete_date == null;
          });
          latest = _.map(documents, function(document) {
            var revision, this_revision, _i, _len, _ref;
            revision = null;
            _ref = document.revisions;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              this_revision = _ref[_i];
              if (revision == null) {
                revision = this_revision;
                continue;
              }
              if (!(revision.revision < this_revision.revision)) {
                continue;
              }
              revision = this_revision;
            }
            return new ExternalRevision(document, revision);
          });
          if (reference) {
            return deferred.resolve(latest);
          }
          revisions = [];
          promises = _.map(latest, function(revision) {
            return _this.findRevision(revision.document.id, revision.revision.revision, org, 'id').then(function(doc) {
              return revisions.push(doc);
            });
          });
          return Q.all(promises).then(function() {
            return deferred.resolve(revisions);
          }).fail(deferred.reject);
        };
      })(this);
      this.revisonModel.find({
        organization_id: org
      }, find_callback);
      return deferred.promise;
    };

    RevisionResources.prototype.getRevisions = function(key, org, key_type) {
      var deferred, find_callback, method, options;
      if (key_type == null) {
        key_type = 'key';
      }
      if (key == null) {
        return Q.resolve(new RevisionArray(new this.revisonModel(), []));
      }
      deferred = Q.defer();
      find_callback = (function(_this) {
        return function(err, documents) {
          var count, document, document_index, index, newModel, _i, _len;
          newModel = function() {
            var new_model;
            new_model = new _this.revisonModel();
            if (key_type === 'key') {
              new_model.key = key;
            }
            new_model.organization_id = org;
            return deferred.resolve(new RevisionArray(new_model, []));
          };
          if (err) {
            return newModel();
          }
          if (key_type === 'id') {
            return deferred.resolve(new RevisionArray(documents, documents.revisions));
          }
          count = 0;
          index = -1;
          for (document_index = _i = 0, _len = documents.length; _i < _len; document_index = ++_i) {
            document = documents[document_index];
            if (document.delete_date != null) {
              continue;
            }
            count += 1;
            index = document_index;
          }
          if (count !== 1) {
            return newModel();
          }
          document = documents[index];
          return deferred.resolve(new RevisionArray(document, document.revisions));
        };
      })(this);
      method = key_type === 'id' ? 'findById' : 'find';
      options = key_type === 'id' ? key : {
        key: key,
        organization_id: org
      };
      this.revisonModel[method](options, find_callback);
      return deferred.promise;
    };

    RevisionResources.prototype.update = function(instance) {
      return this.save(instance);
    };

    RevisionResources.prototype.save = function(instance) {
      var deferred, key, type;
      deferred = Q.defer();
      key = instance['revision_map_id'];
      type = 'id';
      if (key == null) {
        key = instance['revision_map_key'];
        type = 'key';
      }
      this.getRevisions(key, instance.organization_id, type).then((function(_this) {
        return function(revisions) {
          var biggest_revision, map_key, model, revision, save_model_callback, save_revisions_callback, _i, _len;
          biggest_revision = -1;
          for (_i = 0, _len = revisions.length; _i < _len; _i++) {
            revision = revisions[_i];
            if (!(revision.revision > biggest_revision)) {
              continue;
            }
            biggest_revision = revision.revision;
          }
          revision = biggest_revision + 1;
          model = _this.create();
          for (key in _this.schema.tree) {
            if (key === '_id' || key === 'id') {
              continue;
            }
            model[key] = instance[key];
          }
          map_key = instance['revision_map_key'] || revisions.revision_model.key;
          revisions.revision_model.key = map_key;
          model['revision_map_id'] = revisions.revision_model;
          model['revision_map_key'] = map_key;
          model['revision'] = revision;
          model['revision_key'] = uuid.v4();
          revisions.push(model);
          revisions.revision_model.revisions.push({
            revision: revision,
            create_date: new Date(),
            key: model['revision_key'],
            external_id: model.id
          });
          revisions.revision_model.organization_id = model.organization_id;
          save_model_callback = function(err) {
            if (err) {
              return deferred.reject(err);
            }
            return deferred.resolve(model);
          };
          save_revisions_callback = function(err) {
            if (err) {
              return deferred.reject(err);
            }
            return model.save(save_model_callback);
          };
          return revisions.revision_model.save(save_revisions_callback);
        };
      })(this)).fail(deferred.reject);
      return deferred.promise;
    };

    RevisionResources.prototype["delete"] = function(instance) {
      var deferred;
      deferred = Q.defer();
      return deferred.promise;
    };

    return RevisionResources;

  })();

  module.exports = RevisionResources;

}).call(this);
