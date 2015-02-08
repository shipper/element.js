(function() {
  var Base, ObjectId, Q, Schema, UnauthorizedError, exports, mongoose, restify, schemajs, uuid, _,
    __hasProp = {}.hasOwnProperty;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.Types.ObjectId;

  uuid = require('node-uuid');

  schemajs = require('schemajs');

  Q = require('q');

  _ = require('lodash');

  restify = require('restify');

  Base = require('./base.json');

  UnauthorizedError = restify.UnauthorizedError;

  module.exports = exports = new Schema({
    name: String,
    description: String,
    definition: {},
    organization_id: {
      type: ObjectId,
      required: true
    },
    revision_map_id: {
      type: ObjectId,
      required: true
    },
    revision_map_key: String,
    revision: Number,
    revision_key: String
  });

  exports.statics.Base = Base;

  exports.statics.getDefinition = function(id, organization_id) {
    var deferred;
    if (organization_id == null) {
      organization_id = void 0;
    }
    deferred = Q.defer();
    this.findById(id, function(err, type) {
      if (err) {
        return deferred.reject(err);
      }
      if ((type.organization_id != null) && type.organization_id !== organization_id) {
        return deferred.reject(new UnauthorizedError());
      }
      return type.getDefinition().then(deferred.resolve).fail(deferred.reject);
    });
    return deferred.promise;
  };

  exports.methods.getDefinition = function() {
    var definition, findRefs, promises, renameSchema, schema;
    schema = {};
    promises = [];
    definition = _.cloneDeep(this.definition);
    renameSchema = function(parent, key_c, obj) {
      var index, key_b, res_key, result, value, value_b, _i, _len;
      result = void 0;
      if (!_.isObject(obj)) {
        result = obj;
      } else if (_.isArray(obj)) {
        result = [];
        for (index = _i = 0, _len = obj.length; _i < _len; index = ++_i) {
          value = obj[index];
          renameSchema(result, index, value);
        }
      } else if (_.isPlainObject(obj)) {
        result = {};
        for (key_b in obj) {
          if (!__hasProp.call(obj, key_b)) continue;
          value_b = obj[key_b];
          res_key = key_b.toLowerCase() === 'definition' ? 'schema' : key_b;
          renameSchema(result, res_key, value_b);
        }
      }
      if (!(_.isObject(parent) && (key_c != null))) {
        return result;
      }
      parent[key_c] = result;
      return parent;
    };
    schema = renameSchema(null, null, definition);
    findRefs = (function(_this) {
      return function(schema) {
        var key_a, promise, value_a;
        promises = [];
        if (!_.isPlainObject(schema)) {
          return Q.resolve();
        }
        for (key_a in schema) {
          if (!__hasProp.call(schema, key_a)) continue;
          value_a = schema[key_a];
          if ((value_a != null ? value_a.$ref : void 0) == null) {
            promises.push(findRefs(schema[key_a]));
            continue;
          }
          promise = _this.constructor.getDefinition(value_a.$ref, _this.organization_id).then(function(child) {
            return schema[key_a] = child.schema;
          });
          promises.push(promise);
        }
        if (!promises.length) {
          return Q.resolve();
        }
        return Q.all(promise);
      };
    })(this);
    _.each(_.keys(this.schema), (function(_this) {
      return function(key) {
        var promise;
        promise = findRefs(_this.schema[key]);
        return promises.push(promise);
      };
    })(this));
    if (promises.length === 0) {
      return Q.resolve(schema);
    }
    return Q.all(promises).then(function() {
      return schema;
    });
  };

  exports.methods.validateData = function(data) {
    return this.getDefinition().then(function(schema) {
      var form;
      form = schema.validate(data);
      if (!form.valid) {
        throw new Error(JSON.stringify(form.errors));
      }
      return form.data;
    });
  };

}).call(this);
