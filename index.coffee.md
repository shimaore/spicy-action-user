    seem = require 'seem'
    PouchDB = require 'pouchdb'

    @name = (require './package').name
    debug = (require 'debug') @name

    @include = ->

      return unless @cfg.users?.db?

      prefix = @cfg.users.prefix ?= 'org.couchdb.user'

      user_db = new PouchDB @cfg.users.db

* doc.user._id (string) `<cfg.users.prefix>:<couchdb_username>`

      @helper get_user: ->
        unless @session.couchdb_username?
          return null

        name = @session.couchdb_username
        _id = [prefix,name].join ':'
        debug 'get_user', {name,_id}
        user_db
          .get _id
          .catch -> {_id,name,roles:[],type:'user'}

      @helper save_user: seem ->
        unless @session.couchdb_username?
          return {}

        doc = yield @get_user()

        doc.locale = @session.locale
        doc.timezone = @session.timezone
        if not doc.database? and @session.database?
          doc.database = @session.database

        debug 'save_user', doc

        user_db
          .put doc

      @helper load_user: seem ->
        unless @session.couchdb_username?
          return

        unless @cfg.users?.db?
          return

        unless @session?
          return

Retrieve CouchDB data (locale, timezone, extra roles) for the user.

* cfg.users.db (URI) Points to the `users` database, including authentication.
* cfg.users.prefix (string) Prefix for user IDs [default: `org.couchdb.user`]

        doc = yield @get_user()

The user record might not exist, or might be empty, etc.

* doc.user.locale (string) user locale
* doc.user.timezone (string) user timezone
* doc.user.database (string) user database
* doc.user.roles (array) user roles

        @session.locale ?= doc.locale
        @session.timezone ?= doc.timezone
        @session.database ?= doc.database
        if doc.roles?
          @session.couchdb_roles ?= []
          for r in doc.roles when r not in @session.couchdb_roles
            @session.couchdb_roles.push r

        return

      @on 'set_locale', seem (locale) ->
        @session.locale = locale
        res = yield @save_user().catch {}
        @ack if res.ok then ok:true else failed:true

      @put '/locale/:locale', seem ->
        @session.locale = @params.locale
        res = yield @save_user().catch {}
        @json if res.ok then ok:true else failed:true

      @on 'set_timezone', seem (timezone) ->
        @session.timezone = timezone
        res = yield @save_user().catch {}
        @ack if res.ok then ok:true else failed:true

      @put '/timezone/:timezone', seem ->
        @session.timezone = @params.locale
        res = yield @save_user().catch {}
        @json if res.ok then ok:true else failed:true

Middleware
==========

Inject `locale`, `timezone`, and `database` into the session.

    @middleware = seem ->

      yield @load_user()
        .catch (error) ->
          debug "load_user failed: #{error}"

      @next()
