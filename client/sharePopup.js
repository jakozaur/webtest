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
  },
  'click #example-1': function () {
    Session.set('showExamples', undefined);
    Session.set('phantomCode', Session.get('example-1'));
  },
  'click #example-2': function () {
    Session.set('showExamples', undefined);
    Session.set('phantomCode', Session.get('example-2'));

  },
  'click #example-3': function () {
    Session.set('showExamples', undefined);
    Session.set('phantomCode', Session.get('example-3'));
  }
})





