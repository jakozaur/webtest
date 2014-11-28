var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  runPhantomJsCode: function(code, viewportSize) {
    function runCode(code, viewportSize, callbackOrigin) {
      var page = require('webpage').create();

      page.viewportSize = viewportSize;
      page.clipRect = viewportSize;

      var logs = [];

      page.onConsoleMessage = function (msg) {
        logs.push({
          type: 'webpage',
          message: msg
        });
      }

      console.log = function (msg) {
        logs.push({
          type: 'phantom',
          message: msg
        });
      }
      function callback (error, result) {
        result.logs = logs;
        callbackOrigin(error, result);
      }
      return eval(code);
    }
    var result = phantom(runCode, code, viewportSize);
    return result;
  }
});
