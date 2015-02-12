jwt   = require( 'jsonwebtoken' )
Agent = require( '../../data/agent' )

validate = ( token, next ) ->

  unless token? and token.length
    return next( new Error( 'No token' ) )

  decoded = jwt.decode( token )

  unless (
    decoded? and
      decoded instanceof Object and
      decoded[ 'type' ]? and
      decoded[ 'set' ]? and
      decoded[ 'influence' ]? and
      decoded[ 'key' ]
  )
    return next( new Error( 'Token invalid' ) )

  Agent.findByUUID( decoded.key )
  .then( ( agent ) ->
    if (
      not agent.api?.keys?[ decoded[ 'set' ] ][ decoded[ 'type' ] ] or
      not agent.api.sign_key?.trim().length or
      agent.api.keys[ decoded.set ][ decoded.type ] isnt decoded[ 'influence' ] or
      agent.disabled is true
    )
      return next( new Error( 'Token invalid' ) )

    jwt.verify(
      token,
      agent.api.sign_key,
      ( err ) ->
        if err
          return next( err )

        type = decoded.type

        if type is 'authentication'
          type = 'development'

        agent.environment = type

        next( null, agent )
    )
  )



module.exports = exports = validate