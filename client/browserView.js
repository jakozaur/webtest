Session.setDefault('viewportWidth', 1388);
Session.setDefault('viewportHeight', 768);
Session.setDefault('screenshootSelected', 0);

Template.browserView.helpers({
  tabs: function () {
    return Session.get('screenshoots').map(function (item, index) {
      return {
        index: index,
        name: item.name
      };
    });
  },
  url: function () {
    return Session.get('screenshoots')[Session.get('screenshootSelected')].url;
  },
  screenshoots: function () {
    return Session.get('screenshoots').map(function (item, index) {
      item.index = index;
      return item;
    });
  }
});

Template.browserView.events({
});

Template.browserViewTab.helpers({
  selected: function () {
    if (Session.get('screenshootSelected') == this.index) {
      return 'selected';
    } else {
      return '';
    }
  }
});

Template.browserViewTab.events({
  'click div': function () {
    Session.set('screenshootSelected', this.index);
  }
});

Template.browserViewScreenshoot.helpers({
  selected: function () {
    if (Session.get('screenshootSelected') == this.index) {
      return 'selected';
    } else {
      return '';
    }
  }

});
