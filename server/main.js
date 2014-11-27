var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  runPhantomJsCode: function(code, viewportSize) {
    function runCode(code, viewportSize, callback) {
      return eval(code);
    }
    var result = phantom(runCode, code, viewportSize);
    return result;
  }
});
