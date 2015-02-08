Q = require( 'q' )

module.exports = ( scope, func, args ) ->

  newArgs = [ ]
  i = 2
  while i < arguments.length
    newArgs.push( arguments[ i ] )
    i++

  deferred = Q.defer( )

  callback = ( err, result ) ->
    if err
      return deferred.reject( err )
    deferred.resolve( result )

  newArgs.push( callback )

  func.apply( scope, newArgs )

  return deferred.promise