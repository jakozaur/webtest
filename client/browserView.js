Session.setDefault('title', "(none)");
Session.setDefault('viewportWidth', 1388);
Session.setDefault('viewportHeight', 768);

Template.browserView.helpers({
  title: function () {
    return Session.get('title');
  },
  screenshoot: function () {
    return Session.get('screenshoot');
  }
});

Template.browserView.events({
});
