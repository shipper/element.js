ExternalRevision = require( './external-revision' )
_                = require( 'lodash' )
Q                = require( 'q' )

class RevisionArray extends Array
  constructor: ( @revision_model, revisions = undefined ) ->
    super( )

    if revisions instanceof Array
      _.map( revisions, ( revision ) =>
        @push( revision )
      )

  save: ->
    deferred = Q.defer( )

    @revision_model.revisions = @

    callback = ( err ) =>
      if err
        return deferred.reject( err )
      return deferred.resolve( @ )

    @revision_model.save( callback )

    return deferred.promise

  toBSON: ->
    return @toJSON( )

  toJSON: ->
    arr = [ ]

    _.map( @, ( element ) =>
      arr.push( new ExternalRevision( @revision_model, element ) )
    )

    return arr

module.exports = RevisionArray