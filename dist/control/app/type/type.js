(function() {
  var Property, TypeConfig, TypeCtrl,
    __hasProp = {}.hasOwnProperty;

  Property = (function() {
    function Property(_at_name, _at_type, _at_$scope) {
      this.name = _at_name;
      this.type = _at_type;
      this.$scope = _at_$scope;
    }

    Property.prototype.remove = function() {
      var index, props;
      props = this.$scope.values.properties;
      index = props.indexOf(this);
      if (index === -1) {
        return;
      }
      return props.splice(index, 1);
    };

    Property.prototype.isTop = function() {
      return this.$scope.values.properties.indexOf(this) === 0;
    };

    Property.prototype.isBottom = function() {
      var props;
      props = this.$scope.values.properties;
      return props.indexOf(this) === props.length - 1;
    };

    Property.prototype.up = function() {
      var index, props;
      props = this.$scope.values.properties;
      index = props.indexOf(this);
      if (index < 1) {
        return;
      }
      props[index] = props[index - 1];
      props[index - 1] = this;
      return this.index = index - 1;
    };

    Property.prototype.down = function() {
      var index, props;
      props = this.$scope.values.properties;
      index = props.indexOf(this);
      if (index >= props.length - 1) {
        return;
      }
      props[index] = props[index + 1];
      props[index + 1] = this;
      return this.index = index + 1;
    };

    return Property;

  })();

  TypeCtrl = function($scope, $routeParams, $http, rfc4122) {
    var getDefinition, getType;
    $scope.key = $routeParams.key;
    $scope.values = {
      name: '',
      description: '',
      properties: [],
      main: null,
      "true": true,
      "false": false
    };
    $scope.isNotSavable = function() {
      var _ref, _ref1, _ref2;
      return !(((_ref = $scope.values.main) != null ? _ref.length : void 0) && ((_ref1 = $scope.values.properties) != null ? _ref1.length : void 0) && ((_ref2 = $scope.values.name) != null ? _ref2.length : void 0));
    };
    $scope.getDefinition = getDefinition = function() {
      var definition, index, opts, prop, _i, _len, _ref;
      definition = {};
      _ref = $scope.values.properties;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        prop = _ref[index];
        opts = {
          type: prop.type.type,
          schema: prop.type.schema,
          required: prop.required,
          index: index,
          base: prop.type
        };
        if ($scope.values.main === prop.uuid) {
          opts.main = true;
          opts.required = true;
        }
        definition[prop.name] = opts;
      }
      return definition;
    };
    getType = function() {
      var definition, type;
      definition = getDefinition();
      type = {
        name: $scope.values.name,
        description: $scope.values.description,
        definition: definition
      };
      return type;
    };
    $scope.save = function() {
      var method, query, type;
      type = getType();
      method = 'post';
      query = '/api/type';
      if ($scope.key != null) {
        method = 'put';
        query += "/" + $scope.key;
      }
      return $http[method](query, type).success(function(data, status, headers) {
        var location, regex;
        if (method !== 'post') {
          return;
        }
        location = headers().location;
        regex = /\/?api\/type\/(.+)\/?/g;
        return $scope.key = regex.exec(location)[1];
      });
    };
    $scope.property = {
      name: '',
      type: null,
      required: false,
      addClass: function() {
        if ($scope.property.valid()) {
          return;
        }
        return 'disabled';
      },
      valid: function() {
        var _ref, _ref1, _ref2;
        return ((_ref = $scope.property.name) != null ? _ref.length : void 0) && (((_ref1 = $scope.property.type) != null ? _ref1.name : void 0) != null) && (((_ref2 = $scope.property.type) != null ? _ref2.type : void 0) != null);
      },
      add: function() {
        var index, prop, property, _i, _len, _ref, _ref1;
        if (!$scope.property.valid()) {
          return;
        }
        prop = new Property($scope.property.name, $scope.property.type, $scope);
        prop.uuid = rfc4122.v4();
        if (!((_ref = $scope.values.main) != null ? _ref.length : void 0)) {
          $scope.values.main = prop.uuid;
        }
        prop.required = $scope.property.required;
        index = 0;
        prop.index = index;
        _ref1 = $scope.values.properties;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          property = _ref1[_i];
          index += 1;
          property.index = index;
        }
        $scope.values.properties.unshift(prop);
        $scope.property.name = '';
        $scope.property.type = null;
        return $scope.property.required = false;
      }
    };
    if ($scope.key != null) {
      return $http.get("/api/type/" + $scope.key).success(function(data) {
        var key, prop, val, _ref, _ref1;
        $scope.values.name = data.name;
        $scope.values.description = data.description;
        _ref = data.definition;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          val = _ref[key];
          prop = new Property(key, val.type, $scope);
          prop.required = val.required;
          prop.index = val.index;
          prop.uuid = rfc4122.v4();
          if (val.main || !((_ref1 = $scope.values.main) != null ? _ref1.length : void 0)) {
            $scope.values.main = prop.uuid;
          }
          $scope.values.properties.push(prop);
          $scope.values.properties = $scope.values.properties.sort(function(a, b) {
            return a.index - b.index;
          });
        }
        return $http.get('/api/type/base').success(function(data) {
          var type, _i, _len, _ref2, _results;
          _ref2 = $scope.values.properties;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            val = _ref2[_i];
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (key in data) {
                if (!__hasProp.call(data, key)) continue;
                type = data[key];
                if (type.type !== val.type) {
                  continue;
                }
                val.type = type;
                break;
              }
              return _results1;
            })());
          }
          return _results;
        });
      });
    }
  };

  TypeCtrl.$inject = ['$scope', '$routeParams', '$http', 'rfc4122'];

  TypeConfig = function($routeProvider) {
    return $routeProvider.when('/type/:key?', {
      templateUrl: 'app/type/type.html',
      controller: 'TypeCtrl',
      data: {
        title: 'Type',
        back: '/home'
      }
    });
  };

  TypeConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(TypeConfig).controller('TypeCtrl', TypeCtrl);

}).call(this);
