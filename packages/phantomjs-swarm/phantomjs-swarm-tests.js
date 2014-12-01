

// Write your tests here!
// Here is an example.
Tinytest.add('example', function (test) {
  test.equal(true, true);
});

Tinytest.addAsync('get title of google.com', function (test, next) {
  PhantomJs.run(function (callback) {
    var page = require('webpage').create();
    page.open('http://google.com', function () {
      var title = page.evaluate(function () {
        return document.title;
      });

      callback(undefined, title);
    })
  }, [], function (error, result) {
    test.equal(error, null);
    test.equal(result, "Google");
    next();
  });
});
