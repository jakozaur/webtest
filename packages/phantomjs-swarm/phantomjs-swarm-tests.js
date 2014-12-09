
Tinytest.addAsync('get title of a page', function (test, next) {
  var swarm = new PhantomJsSwarm();
  swarm.run(function (callback) {
    var page = require('webpage').create();
    page.open("http://127.0.0.1:3000/http_test_responder", function () {
      var title = page.evaluate(function () {
        return document.title;
      });

      callback(undefined, title);
    });
  }, [], function (error, result) {
    test.equal(error, null);
    test.equal(result, "Google");
    next();
  });
});

Tinytest.addAsync('return error if JavaScript is broken', function (test, next) {
  var swarm = new PhantomJsSwarm();
  swarm.run(function (callback) {
    This_is_a_bug;
  }, [], function (error, result) {
    test.equal(error, {"error":400,"reason":"ReferenceError: Can\'t find variable: This_is_a_bug"});
    test.equal(result, null);
    next();
  });
});

Tinytest.addAsync('times out on forever loop', function (test, next) {
  var swarm = new PhantomJsSwarm();
  swarm.run(function (callback) {
    while (true) {}
  }, [], function (error, result) {
    test.equal(error, {"code":408,"reason":"The code has timed out"} );
    test.equal(result, null);
    next();
  });
});
