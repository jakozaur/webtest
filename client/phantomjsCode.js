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

Session.setDefault('example-1', "\
var url = 'http://lite.yelp.com/search?find_desc=seafood&find_loc=94040&find_submit=Search';\n\
\n\
page.open(url, function (status) {\n\
    if (status !== \'success\') {\n\
        console.log(\'Unable to access network\');\n\
    } else {\n\
        var results = page.evaluate(function() {\n\
            var list = document.querySelectorAll('address'), seafood = [], i;\n\
            for (i = 0; i < list.length; i++) {\n\
                seafood.push(list[i].innerText);\n\
            }\n\
            return seafood;\n\
        });\n\
        console.log(results.join('\\n'));\n\
    }\n\
    phantom.exit();\n\
});");

Session.setDefault('example-2', "page.onConsoleMessage = function(msg) {\n\
    console.log(msg);\n\
};\n\
page.open(\"http://www.phantomjs.org\", function(status) {\n\
    if ( status === \"success\" ) {\n\
        page.includeJs(\"http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js\", function() {\n\
            page.evaluate(function() {\n\
                console.log(\"$(\\\".explanation\\\").text() -> \" + $(\".explanation\").text());\n\
                console.log(\"$(\\\"h1\\\").text() -> \" + $(\"h1\").text());\n\
            });\n\
            phantom.exit();\n\
        });\n\
    }\n\
});\n\
"); 

Session.setDefault('example-3', "page.viewportSize = { width: 320, height: 480 };\n\
page.open(\'http://news.google.com/news/i/section?&topic=t\', function (status) {\n\
    if (status !== \'success\') {\n\
        console.log(\'Unable to access the network!\');\n\
    } else {\n\
        page.evaluate(function () {\n\
            var body = document.body;\n\
            body.style.backgroundColor = \'#fff\';\n\
            body.querySelector(\'div#title-block\').style.display = \'none\';\n\
            body.querySelector(\'form#edition-picker-form\').parentElement.parentElement.style.display = \'none\';\n\
        });\n\
        page.render(\'technews.png\');\n\
    }\n\
    phantom.exit();\n\
});")

Session.setDefault('phantomRun', false);

Template.phantomjsCode.rendered = function () {
	CodeMirror.fromTextArea(this.find("#code-head"), {
    mode: 'javascript',
    theme: '3024-night',
    lineNumbers: true,
    readOnly: true
  });

  var editor = CodeMirror.fromTextArea(this.find("#code"), {
    mode: 'javascript',
    lineNumbers: true,
    firstLineNumber: 3
  });

  editor.on('change', function(doc) {
    Session.set('phantomCode', doc.getValue());
	});

  Tracker.autorun(function () {
    if (!editor.hasFocus()) {
      editor.setValue(Session.get('phantomCode'));
    }
  });
}

Template.phantomjsCode.helpers({
  codeHead: function () {
    return ["var page = require('webpage').create();",
      "// ... We take care of setup, put your code below..."].join("\n");
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
  'click button.run': function (event, tmpl) {
    console.log("Running PhantomJS code '%s'", Session.get('phantomCode'));
    var viewportSize = {
      width: Session.get('viewportWidth'),
      height: Session.get('viewportHeight')
    };
    Session.set('phantomRun', true);
    Session.set('screenshoots', [{name: "Loading",
      url: "(none)",
      image: WaitingScreenshoot}]);
    Session.set('screenshootSelected', 0);
    Meteor.call('runPhantomJsCode', Session.get('phantomCode'), viewportSize,
        function (error, result) {
      if (error) {
        console.log("The error is", error);
        console.log(JSON.stringify(error));
        Session.set('screenshoots', [{name: "Error (check logs below)",
          url: "(none)",
          image: ErrorScreenshoot}]);
        Session.set('screenshootSelected', 0);
        Session.set('logs', [{type: 'error', message: error.reason}]);
        Session.set('phantomRun', false);
      } else {
        console.log("The result is", result);
        Session.set('screenshoots', result.screenshoots);
        Session.set('screenshootSelected', result.screenshoots.length - 1);

        Session.set('logs', result.logs);
        Session.set('phantomRun', false);
      }
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
    Session.set('showSharePopup', id);
    Router.go('/' + id);
  },
  'click button.examples': function () {
    Session.set('showExamples', true);
  }
});








