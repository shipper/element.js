ExternalRevision = require( './external-revision' )
_                = require( 'lodash' )

class RevisionArray extends Array
  constructor: ( @revision_model, revisions = undefined ) ->
    super( )

    if revisions instanceof Array
      _.map( revisions, ( revision ) =>
        @push( revision )
      )

  toBSON: ->
    return @toJSON( )

  toJSON: ->
    arr = [ ]

    _.map( @, ( element ) =>
      arr.push( new ExternalRevision( @revision_model, element ) )
    )

    return arr

module.exports = RevisionArray