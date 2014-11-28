Template.phantomjsCode.helpers({
  optionsHead: function () {
    return {
      mode: 'javascript',
      theme: '3024-night',
      lineNumbers: true,
      readOnly: true
    };
  },
  codeHead: function () {
    return ["var page = require('webpage').create();",
      "// ... We take care of setup, put your code below..."].join("\n");
  },
  options: function () {
    return {
      mode: 'javascript',
      lineNumbers: true,
      firstLineNumber: 4
    };
  },
  code: function () {
    return "\
page.open(\"http://google.com\", function (status) {\n\
  //Page is loaded!\n\
  console.log(\"Page Opened!\");\n\
 \n\
  page.render('Google.png');\n\
 \n\
  page.open(\"http://jacek.migdal.pl\", function (status) {\n\
  	phantom.exit();\n\
  });\n\
\n\
});";
  }
});

Template.phantomjsCode.events({
  'click button': function (event, tmpl) {
    var code = tmpl.$('#code').val();
    console.log("Running PhantomJS code '%s'", code);
    var viewportSize = {
      width: Session.get('viewportWidth'),
      height: Session.get('viewportHeight')
    };
    Meteor.call('runPhantomJsCode', code, viewportSize,
        function (error, result) {
      console.log("The result title is %s, errors %s", result, error);
      Session.set('screenshoots', result.screenshoots);
      Session.set('screenshootSelected', result.screenshoots.length - 1);

      Session.set('logs', result.logs);
    });
  }
});
