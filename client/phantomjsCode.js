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
  page.open(url, function (status) {\
    if (status !== \'success\') {\n\
        console.log(\'Unable to access network\');\n\
    } else {\n\
        var results = page.evaluate(function() {\n\
            var list = document.querySelectorAll('address'), pizza = [], i;\n\
            for (i = 0; i < list.length; i++) {\n\
                pizza.push(list[i].innerText);\n\
            }\n\
            return pizza;\n\
        });\n\
        console.log(results.join('\\n'));\n\
    }\n\
    phantom.exit();\n\
});");

Session.setDefault('example-2', "error"); 

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
    Meteor.call('runPhantomJsCode', Session.get('phantomCode'), viewportSize,
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
    Session.set('showSharePopup', id);
    Router.go('/' + id);
  },
  'click button.examples': function () {
    Session.set('showExamples', true);
  }
});








