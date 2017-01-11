A rightful-hot mixin and store to support spicy-action-user

    debug = (require 'debug') "spicy-action-user:mixin"

    module.exports = ->
      init: ->

        @user = {admin:false}

        @ev.on 'user-data', (user) =>
          @update {user}

      include: ->

Notification from server with user-data.

        @on 'ready', ->
          debug 'received ready ← server', @data
          @ev.trigger 'user-data', @data

On ZappaJS-client ready we send a generic `subscribe` message.
In response, the server will emit `ready`.

        @ev.on 'get-user-data', =>
          debug 'get-user-data: emit join → server'
          @emit 'join'

Notification from client with user parameter.

        @ev.on 'set-user-param', (name,value) =>
          debug 'set-user-param → server', name, value
          @emit 'set_user_param', name, value
