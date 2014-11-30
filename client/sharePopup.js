Template.sharePopup.helpers({
  show: function () {
    if (Session.get('showSharePopup')) {
      return 'show';
    } else {
      return '';
    }
  },
  url: function () {
    return Meteor.absoluteUrl(Session.get('showSharePopup')); 
  }
});

Template.sharePopup.events({
  'click a': function () {
    Session.set('showSharePopup', undefined);
  },
  'click .overlay': function () {
    Session.set('showSharePopup', undefined);
  },
  'click input': function (event, tmpl) {
    tmpl.$('input').select();
  }
})
