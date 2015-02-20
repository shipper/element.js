uuid  = require( 'node-uuid' )
Q     = require( 'q' )
jwt   = require( 'jsonwebtoken' )
_     = require( 'lodash' )
Agent = require( '../../data/agent' )

module.exports = exports = ( agent, type = exports.AUTHENTICATION, set = 'default' ) ->

  unless agent?.uuid?
    return Q.reject( 'Invalid agent' )

  unless type? and _.values( exports ).indexOf( type ) isnt -1
    return Q.reject( 'Invalid type' )

  agent.api ?= { }
  agent.api.keys ?= { }

  if agent.api.keys[ set ]?[ type ]? and agent.api.sign_key?
    obj = {
      key: agent.uuid
      type: type
      set: set
    }
    obj.influence = agent.api.keys[ set ][ type ]
    return Q.resolve(
      jwt.sign(
        obj,
        agent.api.sign_key
      )
    )


  update = {
    $set: { }
  }

  unless agent.api.keys[ set ]?[ type ]?.key?
    agent.api.keys[ set ] ?= { }
    agent.api.keys[ set ][ type ] = uuid.v4( )
    update.$set[ "api.keys.#{ set }.#{ type }" ] = agent.api.keys[ set ][ type ]

  unless agent.api.sign_key?
    agent.api.sign_key = uuid.v4()
    update.$set[ 'api.sign_key' ] = agent.api.sign_key

  deferred = Q.defer( )

  agent.update( update, ( err ) ->
    if err
      return next( err )

    deferred.resolve( module.exports( agent, type, set ) )
  )

  return deferred.promise

exports.AUTHENTICATION = 'authentication'
exports.DEVELOPMENT = "development"
exports.PRODUCTION = "production"
