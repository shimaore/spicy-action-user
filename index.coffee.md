    seem = require 'seem'
    PouchDB = require 'pouchdb'
    jsonBody = require 'body/json'

    @include = ->

      return unless @cfg.users?.db?

      prefix = @cfg.users.prefix ?= 'org.couchdb.user'

      user_db = new PouchDB @cfg.users.db

* doc.user._id (string) `<cfg.users.prefix>:<couchdb_username>`

      @helper get_user: ->
        name = @session.couchdb_username
        _id = [prefix,name].join ':'
        user_db
          .get _id
          .catch -> {_id,name,roles:[],type:'user'}

      @helper save_user: seem ->
        doc = yield @get_user()

        doc.locale = @session.locale
        doc.timezone = @session.timezone
        if not doc.database? and @session.database?
          doc.database = @session.database

        user_db
          .put doc

      @on 'set_locale', seem (locale) ->
        @session.locale = locale
        res = yield @save_user().catch {}
        if res.ok
          @ack ok:true
        else
          @ack failed: true

      @put '/locale/:locale', seem ->
        @session.locale = @params.locale
        res = yield @save_user().catch {}
        @json if res.ok then ok:true else failed:true

      @on 'set_timezone', seem (timezone) ->
        @session.timezone = timezone
        res = yield @save_user().catch {}
        if res.ok
          @ack ok:true
        else
          @ack failed: true

      @put '/timezone/:timezone', seem ->
        @session.timezone = @params.locale
        res = yield @save_user().catch {}
        @json if res.ok then ok:true else failed:true

      @post '/vm-auth', jsonBody, seem ->

        if @session.couchdb_token?
          @res.status 400
          @json error:'Already authenticated'
          return

See well-groomed-feast/src/Messaging.coffee.md for the process

        {number,number_domain,pin} = @body

Ensure all parameters are present

        unless number? and number_domain? and pin?
          @res.status 400
          @json error:'Invalid parameters'
          return

Translate the local number

        new_number = @translate_local_number? number, number_domain
        number = new_number if new_number?

        user_id = "#{number}@#{number_domain}"

        number_data = yield @cfg.prov
          .get "number:#{user_id}"
          .catch (error) ->
            {}
          .then (data) ->
            if data?.disabled then {} else data

        unless number_data?._id?
          @res
            .status 404
            .end()
          return

Retrieve the user database

        {user_database} = number_data

        unless user_database?
          @res
            .status 404
            .end()
          return

Retrieve the voicemail-settings document

        db_uri = @cfg.userdb_base_uri + '/' + user_database
        vm_db = new PouchDB db_uri

        vm_settings = yield vm_db
          .get 'voicemail_settings'
          .catch (error) ->
            {}

        yield vm_db.close()

Validate the PIN

        unless vm_settings.pin? and vm_settings.pin is pin
          @res
            .status 404
            .end()

Authenticated OK

        @session.couchdb_username = user_id
        @session.couchdb_roles = [
          "number:#{user_id}"
          "user_database:#{user_database}"
        ]
        @session.full_name = user_id

        @json
          ok:true
          username: @session.couchdb_username
          roles: @session.couchdb_roles

    @middleware = seem ->

      unless @cfg.users?.db?
        @next()
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

      @next()
