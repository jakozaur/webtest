Template.phantomjsCode.events({
  'click button': function (event, tmpl) {
    var code = tmpl.$('textarea').val();
    console.log("Running PhantomJS code '%s'", code);
    var viewportSize = {
      width: Session.get('viewportWidth'),
      height: Session.get('viewportHeight')
    };
    Meteor.call('runPhantomJsCode', code, viewportSize,
        function (error, result) {
      console.log("The result title is %s, errors %s", result, error);
      Session.set('title', result.title);
      Session.set('screenshoot', result.screenshootPngBase64);
    });
  }
});
