(function() {
  var HashTable,
    __hasProp = {}.hasOwnProperty;

  HashTable = (function() {
    HashTable.getHash = function(value) {
      var hash, i;
      hash = 0;
      if (value == null) {
        return hash;
      }
      value = JSON.stringify(value);
      i = 0;
      while (i < value.length) {
        hash = value.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        i += 1;
      }
      return hash;
    };

    HashTable.prototype.$$value = void 0;

    HashTable.prototype.$$hash = void 0;

    function HashTable(_at_$$value) {
      this.$$value = _at_$$value;
      this.state();
    }

    HashTable.prototype.state = function() {
      this.$$hash = this.getHash();
      return this.$$table = this.generateTable();
    };

    HashTable.prototype.getHash = function(value) {
      if (value == null) {
        value = this.$$value;
      }
      return HashTable.getHash(value);
    };

    HashTable.prototype.isDirty = function() {
      return this.$$hash === this.getHash();
    };

    HashTable.prototype.generateTable = function(value) {
      var key, params, res, _i, _len;
      if (value == null) {
        value = this.$$value;
      }
      if (!(_.isArray(value) || _.isPlainObject(value))) {
        return this.getHash(value);
      }
      params = _.keys(value);
      res = _.clone(value);
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        key = params[_i];
        res[key] = this.generateTable(value[key]);
      }
      return res;
    };

    HashTable.prototype.flatten = function(obj) {
      var child_key, child_value, children, key, params, res, _i, _len;
      if (!_.isObject(obj)) {
        return obj;
      }
      params = _.keys(obj);
      res = {};
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        key = params[_i];
        children = this.flatten(obj[key]);
        if (children === obj[key]) {
          res[key] = obj[key];
          continue;
        }
        for (child_key in children) {
          if (!__hasProp.call(children, child_key)) continue;
          child_value = children[child_key];
          res[key + "." + child_key] = child_value;
        }
      }
      return res;
    };

    HashTable.prototype.getChanges = function() {
      var process, table;
      process = (function(_this) {
        return function(table, value) {
          var hash, key, params, res, _i, _len;
          if (_.isNumber(table)) {
            return _this.getHash(value) !== table;
          }
          res = _.clone(value);
          params = _.keys(value);
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            key = params[_i];
            hash = table[key];
            if (hash == null) {
              res[key] = true;
              continue;
            }
            res[key] = process(table[key], value[key]);
          }
          return res;
        };
      })(this);
      table = process(this.$$table, this.$$value);
      if (typeof table === 'boolean') {
        return table;
      }
      return this.flatten(table);
    };

    return HashTable;

  })();

  this.HashTable = HashTable;

}).call(this);
