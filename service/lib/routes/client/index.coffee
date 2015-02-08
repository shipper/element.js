restify = require( 'restify' )

exports.register = ( server ) ->

  directory = './dist/client'

  serve = restify.serveStatic(
    directory: directory
  )

  server.get(
    /\/?client\/(.*\.js)/,
    ( req, res, next ) ->
      regex = /\/?client\/(.*\.js)/
      path = regex.exec( req.path() )[ 1 ]

      # if it walks like a duck...
      newReq = {
        path: ->
          return path
        method: 'GET'
        acceptsEncoding: req.acceptsEncoding
      }

      serve( newReq, res, next )
  )