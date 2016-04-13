    seem = require 'seem'

    @include = ->

      return unless @cfg.users?.db?

      prefix = @cfg.users.prefix ?= 'org.couchdb.user'

      @user_db = new PouchDB @cfg.users.db

      @helper get_user: ->
        name = @session.couchdb_username
        _id = [prefix,name].join ':'
        @user_db
          .get _id
          .catch -> {_id,name,roles:[],type:'user'}

      @helper save_user: seem ->
        doc = yield @get_user()

        doc.locale = @session.locale
        doc.timezone = @session.timezone

        @user_db
          .put doc

      @on 'set_locale', seem (locale) ->
        @session.locale = locale
        res = yield @save_user().catch {}
        if res.ok
          @ack ok:true
        else
          @ack failed: true

      @on 'set_timezone', seem (timezone) ->
        @session.timezone = timezone
        res = yield @save_user().catch {}
        if res.ok
          @ack ok:true
        else
          @ack failed: true

    @middleware = seem ->

      unless @cfg.users?.db?
        @next()
        return

Retrieve CouchDB data (locale, timezone, extra roles) for the user.

* cfg.users.db (URI) Points to the `users` database, including authentication.
* cfg.users.prefix (string) Prefix for user IDs [default: `org.couchdb.user`]

      doc = yield @get_user()

The user record might not exist, or might be empty, etc.

      @session.locale ?= doc.locale
      @session.timezone ?= doc.timezone
      @session.database ?= doc.database
      if doc.roles?
        @session.couchdb_roles ?= []
        for r in doc.roles when r not in @session.couchdb_roles
          @session.couchdb_roles.push r

      @next
