Session.setDefault('logs', []);

Template.consoleLog.helpers({
  logs: function() {
    return Session.get('logs');
  }
});
