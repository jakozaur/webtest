Session.setDefault('viewportWidth', 1388);
Session.setDefault('viewportHeight', 768);
Session.setDefault('screenshootSelected', 0);

Template.browserView.helpers({
  tabs: function () {
    return Session.get('screenshoots').map(function (item, index) {
      return {
        id: index,
        name: item.name
      };
    });
  },
  screenshoot: function () {
    var screenshoots = Session.get('screenshoots');
    return screenshoots[Session.get('screenshootSelected')].image;
  }
});

Template.browserView.events({
});

Template.browserViewTab.events({
  'click button': function () {
    Session.set('screenshootSelected', this.id);
  }
})
