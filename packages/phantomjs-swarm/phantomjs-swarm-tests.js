
var baseUrl = Meteor.absoluteUrl();

Tinytest.add('need to be create with new', function (test) {
  var ex;
  try {
    PhantomJsSwarm()
  } catch (e) {
    ex = e
  }
  test.instanceOf(ex, Error);
});

Tinytest.addAsync('get title of a page', function (test, next) {
  var swarm = new PhantomJsSwarm();
  swarm.run(function (baseUrl, callback) {
    var page = require('webpage').create();
    page.open(baseUrl + "google-title", function () {
      var title = page.evaluate(function () {
        return document.title;
      });

      callback(undefined, title);
    });
  }, [baseUrl], function (error, result) {
    test.equal(error, null);
    test.equal(result, "Google");
    next();
  });
});

Tinytest.addAsync('be able to run in parallel', function (test, next) {
  var count = 0;
  var threads = 5;
  var swarm = new PhantomJsSwarm();
  for (var i = 0; i < threads; i++) {
    swarm.run(function (callback) {
      setTimeout(function () {
        callback(undefined, "PASS");
      }, 1000);
    }, [], Meteor.bindEnvironment(function (error, result) {
      test.equal(error, null);
      test.equal(result, "PASS");
      count = count + 1;
    }));
  }
  var cutoffMs = 5000 + new Date().getTime();
  var poll = setInterval(Meteor.bindEnvironment(function () {
    if (count == threads || cutoffMs < new Date().getTime()) {
      clearInterval(poll);
      test.equal(count, threads);
      next();
    }
  }), 10);
});

// Invalid
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
  var swarm = new PhantomJsSwarm({defaultTimeoutMs: 3000});
  swarm.run(function (callback) {
    while (true) {}
  }, [], function (error, result) {
    test.equal(error, {"code":408,"reason":"The code has timed out"} );
    test.equal(result, null);
    next();
  });
});
