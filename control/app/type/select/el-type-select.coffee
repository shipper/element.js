ElTypeSelectDialogCtrl = ( $scope, $mdDialog, $http, type ) ->
  $scope.hide = ->
    $mdDialog.hide( )

  $scope.cancel = ->
    $mdDialog.cancel()

  $scope.select = ( type ) ->
    $mdDialog.hide( type )

  $scope.types = { }
  $scope.typesValues = [ ]

  promise = undefined
  if type?() is 'user'
    promise = $http.get( '/api/type')

  else
    promise = $http.get( '/api/type/base')

  promise
  .success(( data ) ->
    $scope.types = data
    $scope.typesValues = _.values( data )
  )


ElTypeSelectDialogCtrl.$inject = [ '$scope', '$mdDialog', '$http', 'type' ]

ElTypeSelectCtrl = ( $scope, $mdDialog ) ->

  $scope.elSelected = $scope.elSelected or null

  $scope.select = ( event ) ->
    $mdDialog.show(
      controller: ElTypeSelectDialogCtrl
      templateUrl: 'app/type/select/el-type-select-dialog.html'
      targetEvent: event
      locals: {
        type: $scope.type
      }
    )
    .then( ( selected ) ->
      $scope.elSelected = selected
    )

ElTypeSelectCtrl.$inject = [ '$scope', '$mdDialog' ]

ElTypeSelect = ->
  return {
    restrict: 'E'
    controller: ElTypeSelectCtrl
    templateUrl: 'app/type/select/el-type-select.html',
    scope: {
      type: '&',
      elSelected: '='
    }
  }

ElTypeSelect.$inject = [ ]

angular.module( 'ngElement' )
.directive( 'elTypeSelect', ElTypeSelect )