Template.phantomjsCode.helpers({
  options: function () {
    return {
      mode: 'javascript',
      lineNumbers: true
    };
  },
  code: function () {
    return "\
var page = require('webpage').create();\n\
\n\
page.viewportSize = viewportSize;\n\
\n\
page.open(\"http://google.com\", function (status) {\n\
  //Page is loaded!\n\
  console.log(\"Page Opened!\");\n\
  var base64 = page.renderBase64('PNG');\n\
  var title = page.evaluate(function () {\n\
    return document.title;\n\
  });\n\
\n\
  var result = {\n\
    'screenshootPngBase64': base64,\n\
    'title': title\n\
  };\n\
\n\
  callback(undefined, result);\n\
  //phantom.exit();\n\
});\n\
    ";
  }
});

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
