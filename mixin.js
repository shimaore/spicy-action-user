// Generated by CoffeeScript 1.12.2
(function() {
  var debug;

  debug = (require('debug'))("spicy-action-user:mixin");

  module.exports = function() {
    return {
      init: function() {
        this.user = {
          admin: false
        };
        this.ev.on('user-data', (function(_this) {
          return function(user) {
            return _this.update({
              user: user
            });
          };
        })(this));
        return this.on('mount', (function(_this) {
          return function() {
            return _this.ev.trigger('get-user-data');
          };
        })(this));
      },
      include: function() {
        this.on('ready', function() {
          debug('received ready ← server', this.data);
          return this.ev.trigger('user-data', this.data);
        });
        this.ev.on('get-user-data', (function(_this) {
          return function() {
            debug('get-user-data: emit join → server');
            return _this.emit('join');
          };
        })(this));
        return this.ev.on('set-user-param', (function(_this) {
          return function(name, value) {
            debug('set-user-param → server', name, value);
            return _this.emit('set_user_param', name, value);
          };
        })(this));
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtaXhpbi5jb2ZmZWUubWQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVJO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxPQUFBLENBQVEsT0FBUixDQUFELENBQUEsQ0FBa0IseUJBQWxCOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7V0FDZjtNQUFBLElBQUEsRUFBTSxTQUFBO1FBRUosSUFBQyxDQUFBLElBQUQsR0FBUTtVQUFDLEtBQUEsRUFBTSxLQUFQOztRQUVSLElBQUMsQ0FBQSxFQUFFLENBQUMsRUFBSixDQUFPLFdBQVAsRUFBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO21CQUNsQixLQUFDLENBQUEsTUFBRCxDQUFRO2NBQUMsTUFBQSxJQUFEO2FBQVI7VUFEa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCO2VBR0EsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDWCxLQUFDLENBQUEsRUFBRSxDQUFDLE9BQUosQ0FBWSxlQUFaO1VBRFc7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7TUFQSSxDQUFOO01BVUEsT0FBQSxFQUFTLFNBQUE7UUFJUCxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxTQUFBO1VBQ1gsS0FBQSxDQUFNLHlCQUFOLEVBQWlDLElBQUMsQ0FBQSxJQUFsQztpQkFDQSxJQUFDLENBQUEsRUFBRSxDQUFDLE9BQUosQ0FBWSxXQUFaLEVBQXlCLElBQUMsQ0FBQSxJQUExQjtRQUZXLENBQWI7UUFPQSxJQUFDLENBQUEsRUFBRSxDQUFDLEVBQUosQ0FBTyxlQUFQLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDdEIsS0FBQSxDQUFNLG1DQUFOO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sTUFBTjtVQUZzQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7ZUFNQSxJQUFDLENBQUEsRUFBRSxDQUFDLEVBQUosQ0FBTyxnQkFBUCxFQUF5QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLElBQUQsRUFBTSxLQUFOO1lBQ3ZCLEtBQUEsQ0FBTSx5QkFBTixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QzttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLGdCQUFOLEVBQXdCLElBQXhCLEVBQThCLEtBQTlCO1VBRnVCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtNQWpCTyxDQVZUOztFQURlO0FBRmpCIiwic291cmNlc0NvbnRlbnQiOlsiQSByaWdodGZ1bC1ob3QgbWl4aW4gYW5kIHN0b3JlIHRvIHN1cHBvcnQgc3BpY3ktYWN0aW9uLXVzZXJcblxuICAgIGRlYnVnID0gKHJlcXVpcmUgJ2RlYnVnJykgXCJzcGljeS1hY3Rpb24tdXNlcjptaXhpblwiXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IC0+XG4gICAgICBpbml0OiAtPlxuXG4gICAgICAgIEB1c2VyID0ge2FkbWluOmZhbHNlfVxuXG4gICAgICAgIEBldi5vbiAndXNlci1kYXRhJywgKHVzZXIpID0+XG4gICAgICAgICAgQHVwZGF0ZSB7dXNlcn1cblxuICAgICAgICBAb24gJ21vdW50JywgPT5cbiAgICAgICAgICBAZXYudHJpZ2dlciAnZ2V0LXVzZXItZGF0YSdcblxuICAgICAgaW5jbHVkZTogLT5cblxuTm90aWZpY2F0aW9uIGZyb20gc2VydmVyIHdpdGggdXNlci1kYXRhLlxuXG4gICAgICAgIEBvbiAncmVhZHknLCAtPlxuICAgICAgICAgIGRlYnVnICdyZWNlaXZlZCByZWFkeSDihpAgc2VydmVyJywgQGRhdGFcbiAgICAgICAgICBAZXYudHJpZ2dlciAndXNlci1kYXRhJywgQGRhdGFcblxuT24gWmFwcGFKUy1jbGllbnQgcmVhZHkgd2Ugc2VuZCBhIGdlbmVyaWMgYHN1YnNjcmliZWAgbWVzc2FnZS5cbkluIHJlc3BvbnNlLCB0aGUgc2VydmVyIHdpbGwgZW1pdCBgcmVhZHlgLlxuXG4gICAgICAgIEBldi5vbiAnZ2V0LXVzZXItZGF0YScsID0+XG4gICAgICAgICAgZGVidWcgJ2dldC11c2VyLWRhdGE6IGVtaXQgam9pbiDihpIgc2VydmVyJ1xuICAgICAgICAgIEBlbWl0ICdqb2luJ1xuXG5Ob3RpZmljYXRpb24gZnJvbSBjbGllbnQgd2l0aCB1c2VyIHBhcmFtZXRlci5cblxuICAgICAgICBAZXYub24gJ3NldC11c2VyLXBhcmFtJywgKG5hbWUsdmFsdWUpID0+XG4gICAgICAgICAgZGVidWcgJ3NldC11c2VyLXBhcmFtIOKGkiBzZXJ2ZXInLCBuYW1lLCB2YWx1ZVxuICAgICAgICAgIEBlbWl0ICdzZXRfdXNlcl9wYXJhbScsIG5hbWUsIHZhbHVlXG4iXX0=
//# sourceURL=/srv/home/stephane/Artisan/Managed/Telecoms/spicy-action-user/mixin.coffee.md