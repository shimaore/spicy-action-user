A rightful-hot mixin to support spicy-action-user

    debug = (require 'debug') "spicy-action-user:mixin"

    module.exports = ->
      init: ->

        @user = {admin:false}

        @on 'mount', ->
          @ev.on 'user-data', (user) =>
            # debug 'user-data', user
            @update {user}

      include: ({ev}) ->

The `ready` event from the server-side provides `user_data`.

        @on 'ready', ->
          debug 'received ready', @data

Return user-data

          @ev.trigger 'user-data', @data
