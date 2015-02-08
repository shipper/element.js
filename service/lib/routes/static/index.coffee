restify = require( 'restify' )

exports.register = ( server ) ->

  directory = './dist/control'

  serve = restify.serveStatic(
    directory: directory
  )

  server.get(
    /^(?!\/?api)\/?$/,
    ( req, res, next ) ->

      # if it walks like a duck...
      newReq = {
        path: ->
          return 'index.html'
        method: 'GET'
        acceptsEncoding: req.acceptsEncoding
      }

      serve( newReq, res, next )
  )

  server.get(
    /^(?!\/?api)\/?.*$/,
    serve
  )

