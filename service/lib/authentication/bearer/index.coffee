BearerStrategy  = require( 'passport-http-bearer' ).Strategy
validate        = require( './validate' )

exports._passport = null
exports._authenticate = null

exports.authenticate = ( req, res, next ) ->
  exports._authenticate( req, res, next )

exports.register = ( passport ) ->
  exports._passport = passport

  passport.use(
    exports.Strategy = new BearerStrategy(
      validate
    )
  )

  exports._authenticate = passport.authenticate(
    'bearer',
    session: no
  )
