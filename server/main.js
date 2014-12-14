var phantomSwarm;
Meteor.startup(function () {
  phantomSwarm = new PhantomJsSwarm();

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
      var myRequire = function (name) {
        if (name !== 'webpage') {
          throw new Error("require() in PhantomJS Pad support only 'webpage' " +
            "b/c of security issues. Let authors know if you need it.");
        } else {
          var webpage = require('webpage');
          var myWebpage = Object.create(webpage);
          myWebpage.create = function () {
            var page = webpage.create();

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

            var myPage = Object.create(page);
            myPage.render = function(name) {
              result.screenshoots.push({
                name: name,
                url: page.url,
                image: page.renderBase64('PNG')
              });
            }

            return myPage;
          };

          return myWebpage;
        }
      };

      console.log = function (msg) {
        result.logs.push({
          type: "phantom",
          message: msg
        });
      }

      var myPhantom = Object.create(phantom);
      myPhantom.exit = function () {
        result.screenshoots.push({
          name: "phantom.exit()",
          url: page.url,
          image: page.renderBase64('PNG')
        });
        callbackOrigin(undefined, result);
      }

      var myWindow = {};
      myWindow.setTimeout = setTimeout;
      myWindow.setInterval = setInterval;
      myWindow.clearInterval = clearInterval;

      var page = myRequire('webpage').create();

      var func = new Function('page', 'phantom', 'require', 'window', code);

      return func(page, myPhantom, myRequire, myWindow);
    }
    return Meteor.wrapAsync(phantomSwarm.run)(runCode, [code, viewportSize]);
  }
});
