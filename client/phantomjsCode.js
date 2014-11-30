Session.setDefault('phantomCode', "\
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
});");

Session.setDefault('phantomRun', false);

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
    return Session.get('phantomCode');
  },
  phantomRun: function () {
    if (Session.get('phantomRun')) {
      return "Running";
    } else {
      return "Run";
    };
  },
  running: function () {
    if (Session.get('phantomRun')) {
      return "refresh";
    } else {
      return " ";
    }
  }
});

Template.phantomjsCode.events({
  'input #code': function (event, tmpl) {
    Session.set('phantomCode', tmpl.$('#code').val());
  },
  'click button.run': function (event, tmpl) {
    var code = tmpl.$('#code').val();
    console.log("Running PhantomJS code '%s'", code);
    var viewportSize = {
      width: Session.get('viewportWidth'),
      height: Session.get('viewportHeight')
    };
    Session.set('phantomRun', true);
    Meteor.call('runPhantomJsCode', code, viewportSize,
        function (error, result) {
      console.log("The result title is %s, errors %s", result, error);
      Session.set('screenshoots', result.screenshoots);
      Session.set('screenshootSelected', result.screenshoots.length - 1);

      Session.set('logs', result.logs);
      Session.set('phantomRun', false);
    });
  },
  'click button.share': function () {
    var id = Fiddle.insert({
      code: Session.get('phantomCode'),
      logs: Session.get('logs'),
      screenshoots: Session.get('screenshoots'),
      screenshootSelected: Session.get('screenshootSelected'),
      createdAt: new Date()
    });
    console.log("Saving the fiddle as '%s'", id);
    // TODO: splash screen share
    // TODO: change the url
  }
});
