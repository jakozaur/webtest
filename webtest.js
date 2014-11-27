if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('title', "(none)");
  Session.setDefault('viewportWidth', 1024);
  Session.setDefault('viewportHeight', 768);



  Template.hello.helpers({
    title: function () {
      return Session.get('title');
    },
    screenshoot: function () {
      return Session.get('screenshoot');
    },
    width: function () {
      return Session.get('viewportWidth') + ' px';
    },
    height: function () {
      return Session.get('viewportHeight') + ' px';
    }
  });

  Template.hello.events({
    'click button': function (event, tmpl) {
      var url = tmpl.$('input[type="text"]').val();
      console.log("Rendering site %s", url);
      var viewportSize = {
        width: Session.get('viewportWidth'),
        height: Session.get('viewportHeight')
      };
      Meteor.call('renderSite', url, viewportSize, function (error, result) {
        console.log("The result title is %s, errors %s", result, error);
        Session.set('title', result.title);
        Session.set('screenshoot', result.screenshootPngBase64);
      });
    }
  });
}
