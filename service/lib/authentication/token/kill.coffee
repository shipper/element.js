Generate = require( './generate' )
Q        = require( 'q' )

module.exports = exports = ( agent, type = Generate.AUTHENTICATION, set = 'default' ) ->

  unless (
    type? and
    set? and
    agent?.api?.keys?[ set ]?[ type ]?
  )
    return Q.resolve( @ )

  agent.api.keys[ set ][ type ] = undefined

  update = {
    $unset: {}
  }

  update.$unset[ "api.keys.#{ set }.#{ type }" ] = ""

  deferred = Q.defer();

  agent.update( update, ( err ) ->
    if err
      return deferred.reject( err )
    return deferred.resolve( agent )
  )

  return deferred.promise
