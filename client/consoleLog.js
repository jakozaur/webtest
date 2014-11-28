Session.setDefault('logs', []);

Template.consoleLog.helpers({
  logs: function() {
    return Session.get('logs');
  }
});

Template.consoleLogMessage.helpers({
  typeClass: function() {
    return this.type.replace(' ', '-');
  }
});
