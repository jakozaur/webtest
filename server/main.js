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

      var phantom = {
        // more phantom functions?
        exit: function () {
          callbackOrigin(undefined, {
            logs: logs,
            screenshootPngBase64: page.renderBase64('PNG')
          });
        }
      };
      var func = new Function('page', 'phantom', code);
      return func(page, phantom);
    }
    var result = phantom(runCode, code, viewportSize);
    return result;
  }
});
