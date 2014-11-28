var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  runPhantomJsCode: function(code, viewportSize) {
    function runCode(code, viewportSize, callbackOrigin) {
      var logs = [];
      console.log = function (msg) {
        logs.push({
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
