A rightful-hot mixin and store to support spicy-action-user

    debug = (require 'debug') "spicy-action-user:mixin"

    module.exports = ->
      init: ->

        @user = {admin:false}

        @on 'mount', ->
          @ev.on 'user-data', (user) =>
            # debug 'user-data', user
            @update {user}

      include: ->

Notification from server with user-data.

        @on 'ready', ->
          debug 'received ready', @data
          @ev.trigger 'user-data', @data

On ZappaJS-client ready we send a generic `subscribe` message.
In response, the server will emit `ready`.

        @emit 'join'

Notification from client with user parameter.

        @ev.on 'set-user-param', (name,value) ->
          debug 'set-user-param', name, value
          @emit 'set_user_param', name, value
