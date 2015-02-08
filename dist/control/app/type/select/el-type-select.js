(function() {
  var ElTypeSelect, ElTypeSelectCtrl, ElTypeSelectDialogCtrl;

  ElTypeSelectDialogCtrl = function($scope, $mdDialog, $http, type) {
    var promise;
    $scope.hide = function() {
      return $mdDialog.hide();
    };
    $scope.cancel = function() {
      return $mdDialog.cancel();
    };
    $scope.select = function(type) {
      return $mdDialog.hide(type);
    };
    $scope.types = {};
    $scope.typesValues = [];
    promise = void 0;
    if ((typeof type === "function" ? type() : void 0) === 'user') {
      promise = $http.get('/api/type');
    } else {
      promise = $http.get('/api/type/base');
    }
    return promise.success(function(data) {
      $scope.types = data;
      return $scope.typesValues = _.values(data);
    });
  };

  ElTypeSelectDialogCtrl.$inject = ['$scope', '$mdDialog', '$http', 'type'];

  ElTypeSelectCtrl = function($scope, $mdDialog) {
    $scope.elSelected = $scope.elSelected || null;
    return $scope.select = function(event) {
      return $mdDialog.show({
        controller: ElTypeSelectDialogCtrl,
        templateUrl: 'app/type/select/el-type-select-dialog.html',
        targetEvent: event,
        locals: {
          type: $scope.type
        }
      }).then(function(selected) {
        return $scope.elSelected = selected;
      });
    };
  };

  ElTypeSelectCtrl.$inject = ['$scope', '$mdDialog'];

  ElTypeSelect = function() {
    return {
      restrict: 'E',
      controller: ElTypeSelectCtrl,
      templateUrl: 'app/type/select/el-type-select.html',
      scope: {
        type: '&',
        elSelected: '='
      }
    };
  };

  ElTypeSelect.$inject = [];

  angular.module('ngElement').directive('elTypeSelect', ElTypeSelect);

}).call(this);
