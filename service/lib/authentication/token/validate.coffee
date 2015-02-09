jwt   = require( 'jsonwebtoken' )
Agent = require( '../../data/agent' )

validate = ( token, next ) ->

  unless token? and token.length
    return next( new Error( 'No token' ) )

  getAgent = ( decoded ) ->

    Agent.findByUUID( decoded.key )
    .then( ( agent ) ->
      if (
        agent.api_key isnt decoded.api_key or
        agent.disabled is true
      )
        return next( new Error( 'Token invalid' ) )
      next( null, agent )
    )
    .fail( ( err ) ->
      next( err or new Error( 'Token invalid' ) )
    )

  jwt.verify(
    token,
    process.env.ELEMENT_JWT_KEY ?= 'ELEMENT_DEV',
    ( err ) ->
      if err
        return next( err )

      decoded = jwt.decode( token )

      unless (
        decoded? and
        decoded instanceof Object and
        decoded[ 'api_key' ]? and
        decoded[ 'key' ]
      )
        return next( new Error( 'Token invalid' ) )

      getAgent( decoded )

  )


module.exports = exports = validate