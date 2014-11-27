var phantom;
Meteor.startup(function () {
  phantom = phantomLaunch()

  // code to run on server at startup
});


Meteor.methods({
  renderSite: function(url, viewportSize) {

    function renderPage(url, viewportSize, callback) {
      var page = require('webpage').create();

      page.viewportSize = viewportSize;

      page.open(url, function (status) {
        //Page is loaded!
        console.log("Page Opened!");
        var base64 = page.renderBase64('PNG');
        var title = page.evaluate(function () {
          return document.title;
        });

        var result = {
          'screenshootPngBase64': base64,
          'title': title
        };

        callback(undefined, result);
        //phantom.exit();
      });

    }
    var result = phantom(renderPage, url, viewportSize);
    return result;
  }
});
