A rightful-hot mixin to support spicy-action-user

    pkg = require './package.json'
    debug = (require 'debug') "#{pkg.name}:mixin"

    module.exports = ->
      init: ->

        @user = {admin:false}

        @on 'mount', ->
          @ev.on 'user-data', (user) =>
            # debug 'user-data', user
            @update {user}

      include: ({ev}) ->

The `welcome` event is emitted by the server when the Socket.io connection
is established.

        @on 'welcome', ->
          debug 'welcome', @data
          ev.trigger 'welcome', @data

The `failed` event is emitted by the server instead of the `welcome` message
if the ZappaJS-client negotiation failed.

        @on 'failed', ->
          debug 'failed', @data
          ev.trigger 'socketio-fail'

On ZappaJS-client ready we send a generic `subscribe` message.
In response, the server will emit `ready`.

        ev.on 'ready', =>
          debug 'ready → emit join'
          @emit 'join' # Triggers 'ready' from the server-side.

The `ready` event from the server-side provides `user_data`.

        @on 'ready', ->
          debug 'received ready', @data

Return user-data

          @ev.trigger 'user-data', @data
