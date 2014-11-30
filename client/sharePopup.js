Template.sharePopup.helpers({
  show: function () {
    if (Session.get('showSharePopup')) {
      return 'show';
    } else {
      return '';
    }
  }
});

Template.sharePopup.events({
  'click a': function () {
    Session.set('showSharePopup', undefined);
  },
  'click .overlay': function () {
    Session.set('showSharePopup', undefined);
  }
})
