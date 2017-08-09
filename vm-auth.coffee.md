    seem = require 'seem'
    PouchDB = require 'pouchdb'
    jsonBody = (require 'body-parser').json {}

    @name = "#{(require './package').name}:vm-auth"
    debug  = (require 'debug') @name

    @include = ->

Authenticate using number and voicemail PIN
-------------------------------------------

      @post '/vm-auth', jsonBody, seem ->

        if @session.couchdb_token?
          @res.status 400
          @json error:'Already authenticated'
          return

See well-groomed-feast/src/Messaging.coffee.md for the process

        {number,number_domain,pin} = @body

Ensure all parameters are present

        unless number? and number_domain? and pin?  and
            typeof number is 'string' and
            typeof number_domain is 'string' and
            typeof pin is 'string'
          @res.status 400
          @json error:'Invalid parameters', parameters: @body
          return

Translate the local number

        debug 'before translation', {number,number_domain}

        new_number = yield @translate_local_number? number, number_domain
        number = new_number if new_number?

        debug 'after translation', {number,number_domain}

        user_id = "#{number}@#{number_domain}"

        number_data = yield @cfg.prov
          .get "number:#{user_id}"
          .catch (error) ->
            {}
          .then (data) ->
            if data?.disabled then {} else data

        unless number_data?._id?
          debug 'No _id in', {number_data}
          @res
            .status 404
            .end()
          return

Retrieve the user database

        {user_database} = number_data

        unless user_database?
          debug 'No user_database in', {number_data}
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
        @session.couchdb_token = hex_hmac_sha1 @cfg.couchdb_secret, @session.couchdb_username

        @json
          ok:true
          username: @session.couchdb_username
          roles: @session.couchdb_roles

    crypto = require 'crypto'
    hex_hmac_sha1 = (key,value) ->
      hmac = crypto.createHmac 'sha1', key
      hmac.update value
      hmac.digest 'hex'
