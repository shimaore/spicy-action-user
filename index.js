// Generated by CoffeeScript 1.12.1
(function() {
  var PouchDB, debug, seem,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  seem = require('seem');

  PouchDB = require('pouchdb');

  this.name = (require('./package')).name;

  debug = (require('debug'))(this.name);

  this.include = function() {
    var base, prefix, ref, user_db;
    if (((ref = this.cfg.users) != null ? ref.db : void 0) == null) {
      return;
    }
    prefix = (base = this.cfg.users).prefix != null ? base.prefix : base.prefix = 'org.couchdb.user';
    user_db = new PouchDB(this.cfg.users.db);
    this.helper({
      get_user: function() {
        var _id, name;
        if (this.session.couchdb_username == null) {
          return null;
        }
        name = this.session.couchdb_username;
        _id = [prefix, name].join(':');
        debug('get_user', {
          name: name,
          _id: _id
        });
        return user_db.get(_id)["catch"](function() {
          return {
            _id: _id,
            name: name,
            roles: [],
            type: 'user'
          };
        });
      }
    });
    this.helper({
      save_user: seem(function*() {
        var doc;
        if (this.session.couchdb_username == null) {
          return {};
        }
        doc = (yield this.get_user());
        doc.locale = this.session.locale;
        doc.timezone = this.session.timezone;
        if ((doc.database == null) && (this.session.database != null)) {
          doc.database = this.session.database;
        }
        debug('save_user', doc);
        return user_db.put(doc);
      })
    });
    this.helper({
      load_user: seem(function*() {
        var base1, base2, base3, base4, doc, i, len, r, ref1, ref2, ref3;
        if (((ref1 = this.session) != null ? ref1.couchdb_username : void 0) == null) {
          return;
        }
        if (((ref2 = this.cfg.users) != null ? ref2.db : void 0) == null) {
          return;
        }
        doc = (yield this.get_user());
        if ((base1 = this.session).locale == null) {
          base1.locale = doc.locale;
        }
        if ((base2 = this.session).timezone == null) {
          base2.timezone = doc.timezone;
        }
        if ((base3 = this.session).database == null) {
          base3.database = doc.database;
        }
        if (doc.roles != null) {
          if ((base4 = this.session).couchdb_roles == null) {
            base4.couchdb_roles = [];
          }
          ref3 = doc.roles;
          for (i = 0, len = ref3.length; i < len; i++) {
            r = ref3[i];
            if (indexOf.call(this.session.couchdb_roles, r) < 0) {
              this.session.couchdb_roles.push(r);
            }
          }
        }
      })
    });
    this.on('set_locale', seem(function*(locale) {
      var res;
      this.session.locale = locale;
      res = (yield this.save_user()["catch"]({}));
      return this.ack(res.ok ? {
        ok: true
      } : {
        failed: true
      });
    }));
    this.put('/locale/:locale', seem(function*() {
      var res;
      this.session.locale = this.params.locale;
      res = (yield this.save_user()["catch"]({}));
      return this.json(res.ok ? {
        ok: true
      } : {
        failed: true
      });
    }));
    this.on('set_timezone', seem(function*(timezone) {
      var res;
      this.session.timezone = timezone;
      res = (yield this.save_user()["catch"]({}));
      return this.ack(res.ok ? {
        ok: true
      } : {
        failed: true
      });
    }));
    return this.put('/timezone/:timezone', seem(function*() {
      var res;
      this.session.timezone = this.params.locale;
      res = (yield this.save_user()["catch"]({}));
      return this.json(res.ok ? {
        ok: true
      } : {
        failed: true
      });
    }));
  };

  this.middleware = seem(function*() {
    yield this.load_user()["catch"](function(error) {
      return debug("load_user failed: " + error);
    });
    return this.next();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC5jb2ZmZWUubWQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFJO0FBQUEsTUFBQSxvQkFBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0VBRVYsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFDLE9BQUEsQ0FBUSxXQUFSLENBQUQsQ0FBcUIsQ0FBQzs7RUFDOUIsS0FBQSxHQUFRLENBQUMsT0FBQSxDQUFRLE9BQVIsQ0FBRCxDQUFBLENBQWtCLElBQUMsQ0FBQSxJQUFuQjs7RUFFUixJQUFDLENBQUEsT0FBRCxHQUFXLFNBQUE7QUFFVCxRQUFBO0lBQUEsSUFBYywwREFBZDtBQUFBLGFBQUE7O0lBRUEsTUFBQSxnREFBbUIsQ0FBQyxhQUFELENBQUMsU0FBVTtJQUU5QixPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbkI7SUFJZCxJQUFDLENBQUEsTUFBRCxDQUFRO01BQUEsUUFBQSxFQUFVLFNBQUE7QUFDaEIsWUFBQTtRQUFBLElBQU8scUNBQVA7QUFDRSxpQkFBTyxLQURUOztRQUdBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBTyxDQUFDO1FBQ2hCLEdBQUEsR0FBTSxDQUFDLE1BQUQsRUFBUSxJQUFSLENBQWEsQ0FBQyxJQUFkLENBQW1CLEdBQW5CO1FBQ04sS0FBQSxDQUFNLFVBQU4sRUFBa0I7VUFBQyxNQUFBLElBQUQ7VUFBTSxLQUFBLEdBQU47U0FBbEI7ZUFDQSxPQUNFLENBQUMsR0FESCxDQUNPLEdBRFAsQ0FFRSxFQUFDLEtBQUQsRUFGRixDQUVTLFNBQUE7aUJBQUc7WUFBQyxLQUFBLEdBQUQ7WUFBSyxNQUFBLElBQUw7WUFBVSxLQUFBLEVBQU0sRUFBaEI7WUFBbUIsSUFBQSxFQUFLLE1BQXhCOztRQUFILENBRlQ7TUFQZ0IsQ0FB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SUFBQyxDQUFBLEdBQUQsQ0FBSyxxQkFBTCxFQUE0QixJQUFBLENBQUssVUFBQTtBQUMvQixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULEdBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUM7TUFDNUIsR0FBQSxHQUFNLENBQUEsTUFBTSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVksRUFBQyxLQUFELEVBQVosQ0FBbUIsRUFBbkIsQ0FBTjthQUNOLElBQUMsQ0FBQSxJQUFELENBQVMsR0FBRyxDQUFDLEVBQVAsR0FBZTtRQUFBLEVBQUEsRUFBRyxJQUFIO09BQWYsR0FBNEI7UUFBQSxNQUFBLEVBQU8sSUFBUDtPQUFsQztJQUgrQixDQUFMLENBQTVCO0VBbkZTOztFQTZGWCxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUEsQ0FBSyxVQUFBO0lBRWpCLE1BQU0sSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUNKLEVBQUMsS0FBRCxFQURJLENBQ0csU0FBQyxLQUFEO2FBQ0wsS0FBQSxDQUFNLG9CQUFBLEdBQXFCLEtBQTNCO0lBREssQ0FESDtXQUlOLElBQUMsQ0FBQSxJQUFELENBQUE7RUFOaUIsQ0FBTDtBQW5HZCIsInNvdXJjZXNDb250ZW50IjpbIiAgICBzZWVtID0gcmVxdWlyZSAnc2VlbSdcbiAgICBQb3VjaERCID0gcmVxdWlyZSAncG91Y2hkYidcblxuICAgIEBuYW1lID0gKHJlcXVpcmUgJy4vcGFja2FnZScpLm5hbWVcbiAgICBkZWJ1ZyA9IChyZXF1aXJlICdkZWJ1ZycpIEBuYW1lXG5cbiAgICBAaW5jbHVkZSA9IC0+XG5cbiAgICAgIHJldHVybiB1bmxlc3MgQGNmZy51c2Vycz8uZGI/XG5cbiAgICAgIHByZWZpeCA9IEBjZmcudXNlcnMucHJlZml4ID89ICdvcmcuY291Y2hkYi51c2VyJ1xuXG4gICAgICB1c2VyX2RiID0gbmV3IFBvdWNoREIgQGNmZy51c2Vycy5kYlxuXG4qIGRvYy51c2VyLl9pZCAoc3RyaW5nKSBgPGNmZy51c2Vycy5wcmVmaXg+Ojxjb3VjaGRiX3VzZXJuYW1lPmBcblxuICAgICAgQGhlbHBlciBnZXRfdXNlcjogLT5cbiAgICAgICAgdW5sZXNzIEBzZXNzaW9uLmNvdWNoZGJfdXNlcm5hbWU/XG4gICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBuYW1lID0gQHNlc3Npb24uY291Y2hkYl91c2VybmFtZVxuICAgICAgICBfaWQgPSBbcHJlZml4LG5hbWVdLmpvaW4gJzonXG4gICAgICAgIGRlYnVnICdnZXRfdXNlcicsIHtuYW1lLF9pZH1cbiAgICAgICAgdXNlcl9kYlxuICAgICAgICAgIC5nZXQgX2lkXG4gICAgICAgICAgLmNhdGNoIC0+IHtfaWQsbmFtZSxyb2xlczpbXSx0eXBlOid1c2VyJ31cblxuICAgICAgQGhlbHBlciBzYXZlX3VzZXI6IHNlZW0gLT5cbiAgICAgICAgdW5sZXNzIEBzZXNzaW9uLmNvdWNoZGJfdXNlcm5hbWU/XG4gICAgICAgICAgcmV0dXJuIHt9XG5cbiAgICAgICAgZG9jID0geWllbGQgQGdldF91c2VyKClcblxuICAgICAgICBkb2MubG9jYWxlID0gQHNlc3Npb24ubG9jYWxlXG4gICAgICAgIGRvYy50aW1lem9uZSA9IEBzZXNzaW9uLnRpbWV6b25lXG4gICAgICAgIGlmIG5vdCBkb2MuZGF0YWJhc2U/IGFuZCBAc2Vzc2lvbi5kYXRhYmFzZT9cbiAgICAgICAgICBkb2MuZGF0YWJhc2UgPSBAc2Vzc2lvbi5kYXRhYmFzZVxuXG4gICAgICAgIGRlYnVnICdzYXZlX3VzZXInLCBkb2NcblxuICAgICAgICB1c2VyX2RiXG4gICAgICAgICAgLnB1dCBkb2NcblxuICAgICAgQGhlbHBlciBsb2FkX3VzZXI6IHNlZW0gLT5cbiAgICAgICAgdW5sZXNzIEBzZXNzaW9uPy5jb3VjaGRiX3VzZXJuYW1lP1xuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHVubGVzcyBAY2ZnLnVzZXJzPy5kYj9cbiAgICAgICAgICByZXR1cm5cblxuUmV0cmlldmUgQ291Y2hEQiBkYXRhIChsb2NhbGUsIHRpbWV6b25lLCBleHRyYSByb2xlcykgZm9yIHRoZSB1c2VyLlxuXG4qIGNmZy51c2Vycy5kYiAoVVJJKSBQb2ludHMgdG8gdGhlIGB1c2Vyc2AgZGF0YWJhc2UsIGluY2x1ZGluZyBhdXRoZW50aWNhdGlvbi5cbiogY2ZnLnVzZXJzLnByZWZpeCAoc3RyaW5nKSBQcmVmaXggZm9yIHVzZXIgSURzIFtkZWZhdWx0OiBgb3JnLmNvdWNoZGIudXNlcmBdXG5cbiAgICAgICAgZG9jID0geWllbGQgQGdldF91c2VyKClcblxuVGhlIHVzZXIgcmVjb3JkIG1pZ2h0IG5vdCBleGlzdCwgb3IgbWlnaHQgYmUgZW1wdHksIGV0Yy5cblxuKiBkb2MudXNlci5sb2NhbGUgKHN0cmluZykgdXNlciBsb2NhbGVcbiogZG9jLnVzZXIudGltZXpvbmUgKHN0cmluZykgdXNlciB0aW1lem9uZVxuKiBkb2MudXNlci5kYXRhYmFzZSAoc3RyaW5nKSB1c2VyIGRhdGFiYXNlXG4qIGRvYy51c2VyLnJvbGVzIChhcnJheSkgdXNlciByb2xlc1xuXG4gICAgICAgIEBzZXNzaW9uLmxvY2FsZSA/PSBkb2MubG9jYWxlXG4gICAgICAgIEBzZXNzaW9uLnRpbWV6b25lID89IGRvYy50aW1lem9uZVxuICAgICAgICBAc2Vzc2lvbi5kYXRhYmFzZSA/PSBkb2MuZGF0YWJhc2VcbiAgICAgICAgaWYgZG9jLnJvbGVzP1xuICAgICAgICAgIEBzZXNzaW9uLmNvdWNoZGJfcm9sZXMgPz0gW11cbiAgICAgICAgICBmb3IgciBpbiBkb2Mucm9sZXMgd2hlbiByIG5vdCBpbiBAc2Vzc2lvbi5jb3VjaGRiX3JvbGVzXG4gICAgICAgICAgICBAc2Vzc2lvbi5jb3VjaGRiX3JvbGVzLnB1c2ggclxuXG4gICAgICAgIHJldHVyblxuXG4gICAgICBAb24gJ3NldF9sb2NhbGUnLCBzZWVtIChsb2NhbGUpIC0+XG4gICAgICAgIEBzZXNzaW9uLmxvY2FsZSA9IGxvY2FsZVxuICAgICAgICByZXMgPSB5aWVsZCBAc2F2ZV91c2VyKCkuY2F0Y2gge31cbiAgICAgICAgQGFjayBpZiByZXMub2sgdGhlbiBvazp0cnVlIGVsc2UgZmFpbGVkOnRydWVcblxuICAgICAgQHB1dCAnL2xvY2FsZS86bG9jYWxlJywgc2VlbSAtPlxuICAgICAgICBAc2Vzc2lvbi5sb2NhbGUgPSBAcGFyYW1zLmxvY2FsZVxuICAgICAgICByZXMgPSB5aWVsZCBAc2F2ZV91c2VyKCkuY2F0Y2gge31cbiAgICAgICAgQGpzb24gaWYgcmVzLm9rIHRoZW4gb2s6dHJ1ZSBlbHNlIGZhaWxlZDp0cnVlXG5cbiAgICAgIEBvbiAnc2V0X3RpbWV6b25lJywgc2VlbSAodGltZXpvbmUpIC0+XG4gICAgICAgIEBzZXNzaW9uLnRpbWV6b25lID0gdGltZXpvbmVcbiAgICAgICAgcmVzID0geWllbGQgQHNhdmVfdXNlcigpLmNhdGNoIHt9XG4gICAgICAgIEBhY2sgaWYgcmVzLm9rIHRoZW4gb2s6dHJ1ZSBlbHNlIGZhaWxlZDp0cnVlXG5cbiAgICAgIEBwdXQgJy90aW1lem9uZS86dGltZXpvbmUnLCBzZWVtIC0+XG4gICAgICAgIEBzZXNzaW9uLnRpbWV6b25lID0gQHBhcmFtcy5sb2NhbGVcbiAgICAgICAgcmVzID0geWllbGQgQHNhdmVfdXNlcigpLmNhdGNoIHt9XG4gICAgICAgIEBqc29uIGlmIHJlcy5vayB0aGVuIG9rOnRydWUgZWxzZSBmYWlsZWQ6dHJ1ZVxuXG5NaWRkbGV3YXJlXG49PT09PT09PT09XG5cbkluamVjdCBgbG9jYWxlYCwgYHRpbWV6b25lYCwgYW5kIGBkYXRhYmFzZWAgaW50byB0aGUgc2Vzc2lvbi5cblxuICAgIEBtaWRkbGV3YXJlID0gc2VlbSAtPlxuXG4gICAgICB5aWVsZCBAbG9hZF91c2VyKClcbiAgICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgICBkZWJ1ZyBcImxvYWRfdXNlciBmYWlsZWQ6ICN7ZXJyb3J9XCJcblxuICAgICAgQG5leHQoKVxuIl19
//# sourceURL=/srv/home/stephane/Artisan/Managed/Telecoms/spicy-action-user/index.coffee.md