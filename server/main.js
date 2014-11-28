var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  runPhantomJsCode: function(code, viewportSize) {
    function runCode(code, viewportSize, callbackOrigin) {
      var logs = [];
      var page = require('webpage').create();

      page.viewportSize = viewportSize;
      page.clipRect = viewportSize;

      page.onConsoleMessage = function (msg) {
        logs.push({
          type: 'site',
          message: msg
        });
      }

      page.onError = function (msg, trace) {
        logs.push({
          type: 'site error',
          message: msg,
          trace: trace
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
