class ExternalRevision
  constructor: ( @document, @revision ) ->

  toBSON: ->
    return @toJSON( )

  toJSON: ->
    return {
      revision: @revision.revision
      revision_key: @revision.key
      key: @document.key
      document_create_date: @document.create_date
      create_date: @revision.create_date
    }


module.exports = ExternalRevision