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
});

Template.examples.helpers({
  show: function () {
    if (Session.get('showExamples')) {
      return 'show';
    } else {
      return '';
    }
  }
});

Template.examples.events({
  'click #close': function () {
    Session.set('showExamples', undefined);
  }, 
  'click .overlay': function () {
    Session.set('showExamples', undefined);
  }
})





