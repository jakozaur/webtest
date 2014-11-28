Session.setDefault('viewportWidth', 1388);
Session.setDefault('viewportHeight', 768);

Template.browserView.helpers({
  screenshoot: function () {
    return Session.get('screenshoot');
  }
});

Template.browserView.events({
});
