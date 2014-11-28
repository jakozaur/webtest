var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  runPhantomJsCode: function(code, viewportSize) {
    this.unblock(); // trick to run again

    function runCode(code, viewportSize, callbackOrigin) {
      var result = {
        logs: [],
        screenshoots: []
      };
      var page = require('webpage').create();

      page.viewportSize = viewportSize;
      page.clipRect = viewportSize;

      page.onConsoleMessage = function (msg) {
        result.logs.push({
          type: "site",
          message: msg
        });
      }

      page.onError = function (msg, trace) {
        result.logs.push({
          type: "site error",
          message: msg,
          trace: trace
        });
      }

      console.log = function (msg) {
        result.logs.push({
          type: "phantom",
          message: msg
        });
      }

      var myPage = Object.create(page);
      myPage.render = function(name) {
        result.screenshoots.push({
          name: name,
          image: page.renderBase64('PNG')
        });
      }

      var myPhantom = Object.create(phantom);
      myPhantom.exit = function () {
        result.screenshoots.push({
          name: "phantom.exit()",
          image: page.renderBase64('PNG')
        });
        callbackOrigin(undefined, result);
      }
      var func = new Function('page', 'phantom', code);

      return func(myPage, myPhantom);
    }
    var result = phantom(runCode, code, viewportSize);
    return result;
  }
});
