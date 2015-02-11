(function() {
  var ElementConfig, ElementCtrl,
    __hasProp = {}.hasOwnProperty;

  ElementCtrl = function($scope, $http, $routeParams, $q) {
    var deferred, promise, query, toArray;
    $scope.key = $routeParams.key;
    $scope.element = {};
    $scope["new"] = true;
    $scope.$emit('back-path', "/type/" + $routeParams.type + "/elements");
    $scope.saveWording = function() {
      if ($scope["new"]) {
        return 'Save';
      } else {
        return 'Update';
      }
    };
    $scope.save = function() {
      var element, headers, method, options, query;
      element = $scope.element;
      method = 'POST';
      query = '/api/element';
      if ($scope.key != null) {
        method = 'PUT';
        query += "/" + $scope.key;
      }
      headers = {
        'X-Element-Type-Key': $routeParams.type,
        'X-Element-Type-Revision': $scope.type_revision
      };
      options = {
        method: method,
        url: query,
        headers: headers,
        data: element
      };
      return $http(options).success(function(data, status, headers) {
        var location, regex;
        if (method !== 'post') {
          return;
        }
        location = headers('Location');
        regex = /\/?api\/element\/(.+)\/?/g;
        return $scope.key = regex.exec(location)[1];
      });
    };
    $scope.select = function() {};
    query = "/api/type/" + $routeParams.type;
    if ($routeParams.key) {
      promise = $http.get("/api/element/" + $routeParams.key).success(function(element, status, headers) {
        var key;
        $scope.element = element || {};
        $scope["new"] = !element;
        key = headers('X-Element-Type-Key');
        if (key === $routeParams.type) {
          $scope.type_revision = headers('X-Element-Type-Revision');
          return query += "/revision/" + (headers('X-Element-Type-Revision'));
        }
      });
    } else {
      deferred = $q.defer();
      deferred.resolve();
      promise = deferred.promise;
    }
    toArray = function(definition) {
      return _.map(_.keys(definition), function(key) {
        return {
          key: key,
          value: definition[key],
          index: definition[key].index
        };
      }).sort(function(a, b) {
        return a.index - b.index;
      });
    };
    return promise.then(function() {
      query += "/definition";
      $http.get(query).success(function(definition) {
        $scope.definition = definition;
        return $scope.definitionArray = toArray(definition);
      });
      if ($scope.type_revision != null) {
        return $http.get("/api/type/" + $routeParams.type + "/definition").success(function(definition) {
          var all, key, _ref;
          all = true;
          _ref = $scope.definition;
          for (key in _ref) {
            if (!__hasProp.call(_ref, key)) continue;
            if (definition.hasOwnProperty(key)) {
              continue;
            }
            all = false;
            break;
          }
          if (!all) {
            return;
          }
          $scope.definition = definition;
          return $scope.definitionArray = toArray(definition);
        });
      }
    });
  };

  ElementCtrl.$inject = ['$scope', '$http', '$routeParams', '$q'];

  ElementConfig = function($routeProvider) {
    return $routeProvider.when('/type/:type/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl',
      data: {
        title: 'Element'
      }
    }).when('/type/:type/revision/:type_revision/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl',
      data: {
        title: 'Element'
      }
    });
  };

  ElementConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(ElementConfig).controller('ElementCtrl', ElementCtrl);

}).call(this);
